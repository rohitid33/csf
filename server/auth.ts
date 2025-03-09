import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { IStorage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { env } from './config/env';

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
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
        if (!user || password !== user.password) {
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
      // Validate the ID format first
      if (!id || typeof id !== 'string') {
        console.error('Invalid user ID format:', id);
        return done(null, false);
      }

      try {
        const user = await storage.getUser(id);
        if (!user) {
          console.error('User not found for ID:', id);
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        console.error('Error fetching user:', error);
        done(null, false);
      }
    } catch (error) {
      console.error('Deserialize user error:', error);
      done(error);
    }
  });

  app.post("/api/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: "Username and password are required" 
        });
      }

      // Check if user exists
      let user = await storage.getUserByUsername(username);
      
      if (user) {
        // Existing user - verify password
        if (password !== user.password) {
          return res.status(401).json({ message: "Invalid password" });
        }
      } else {
        // New user - create account
        try {
          user = await storage.createUser({ username, password });
          console.log('New user created:', username);
        } catch (error) {
          console.error('User creation error:', error);
          return res.status(500).json({ 
            message: "Error creating user", 
            error: error instanceof Error ? error.message : String(error) 
          });
        }
      }

      // Login the user
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Session creation error:", loginErr);
          return res.status(500).json({ message: "Error creating session" });
        }
        
        // Return user without sensitive data
        const safeUser = {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt
        };
        
        return res.json(safeUser);
      });
    } catch (error) {
      console.error("Login/Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
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