import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { IStorage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { env } from './config/env';

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express, storage: IStorage) {
  const sessionSettings: session.SessionOptions = {
    secret: env.auth.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.auth.cookieSecure,
      httpOnly: true,
      maxAge: env.auth.sessionDuration,
    },
    store: storage.sessionStore,
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // With MongoDB, we use string IDs
      const user = await storage.getUser(id as string);
      done(null, user);
    } catch (error) {
      console.error('Deserialize user error:', error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      // Validate input for required fields
      if (!req.body.username || !req.body.password || !req.body.email || !req.body.phoneNumber) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: "Username, password, email, and phone number are required" 
        });
      }

      // Explicitly check for firstName and lastName
      if (!req.body.firstName || !req.body.lastName) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: "First name and last name are required" 
        });
      }

      try {
        // Check for existing user
        const existingUser = await storage.getUserByUsername(req.body.username);
        if (existingUser) {
          return res.status(400).json({ message: "Username already exists" });
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
        return res.status(500).json({ 
          message: "Error checking username availability", 
          error: error instanceof Error ? error.message : String(error) 
        });
      }

      // Hash password
      let hashedPassword;
      try {
        hashedPassword = await hashPassword(req.body.password);
      } catch (error) {
        console.error('Password hashing error:', error);
        return res.status(500).json({ 
          message: "Error processing password", 
          error: error instanceof Error ? error.message : String(error) 
        });
      }
      
      // Prepare user data with all required fields
      const userData = {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        isAdmin: false
      };

      console.log('Creating user with data:', {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        password: '[REDACTED]'
      });

      // Create user
      let user;
      try {
        user = await storage.createUser(userData);
      } catch (error) {
        console.error('User creation error:', error);
        return res.status(500).json({ 
          message: "Error creating user in database", 
          error: error instanceof Error ? error.message : String(error) 
        });
      }

      // Login after registration
      req.login(user, (err) => {
        if (err) {
          console.error('Login after registration error:', err);
          return res.status(500).json({ 
            message: "User created but error logging in", 
            error: err.toString() 
          });
        }
        return res.status(201).json({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        });
      });
    } catch (error) {
      console.error('User registration error:', error);
      res.status(500).json({ 
        message: "Error creating user", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: any, info: any) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error during login" });
      }
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session creation error:", loginErr);
          return res.status(500).json({ message: "Error creating session" });
        }
        
        // Return user without sensitive data
        const safeUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        };
        
        return res.json(safeUser);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    res.json(req.user);
  });
}