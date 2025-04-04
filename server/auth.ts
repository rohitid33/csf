import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { IStorage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { env } from './config/env';
import googleAuthRoutes from './routes/google-auth';
import { setupGoogleAuth } from './google-auth-direct';

// Extend express-session types to include passport
declare module 'express-session' {
  interface Session {
    passport: {
      user: string;
    };
  }
}

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

export function setupAuth(app: Express, storage: IStorage) {
  const sessionSettings: session.SessionOptions = {
    secret: env.auth.sessionSecret,
    resave: false, // Changed to false to avoid unnecessary session saves
    saveUninitialized: false,
    rolling: true,
    name: 'sessionId',
    proxy: true,
    cookie: {
      secure: env.auth.cookieSecure,
      httpOnly: true,
      maxAge: env.auth.sessionDuration,
      path: '/',
      sameSite: env.isProduction ? 'strict' : 'lax',
      domain: env.isDevelopment ? undefined : env.server.host
    },
    store: storage.sessionStore,
  };

  if (env.isProduction) {
    app.set('trust proxy', 1);
  }

  // First initialize passport core
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Then set up the Google authentication strategy directly
  // This must happen BEFORE registering routes
  console.log('Setting up direct Google authentication strategy');
  setupGoogleAuth();

  // Add Google authentication routes AFTER strategy is set up
  app.use('/api/auth/google', googleAuthRoutes);

  // Add session debug middleware in development
  if (env.isDevelopment) {
    app.use((req, res, next) => {
      console.log('Session ID:', req.sessionID);
      console.log('Is Authenticated:', req.isAuthenticated());
      console.log('Session Data:', {
        id: req.sessionID,
        cookie: req.session.cookie,
        passport: req.session.passport,
        user: req.user
      });
      next();
    });
  }

  // Add middleware to ensure session consistency
  app.use((req, res, next) => {
    // If user is authenticated but session is about to expire, extend it
    if (req.isAuthenticated() && req.session.cookie && 
        typeof req.session.cookie.maxAge === 'number' && 
        req.session.cookie.maxAge < 1000 * 60 * 10) { // Less than 10 minutes left
      req.session.cookie.maxAge = env.auth.sessionDuration;
      req.session.save();
    }
    next();
  });

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
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log('Deserializing user:', id);
      if (!id) {
        console.error('Invalid user ID format:', id);
        return done(null, false);
      }

      const user = await storage.getUser(id);
      if (!user) {
        console.error('User not found for ID:', id);
        return done(null, false);
      }
      console.log('User deserialized successfully:', user.id);
      done(null, user);
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
          user = await storage.createUser({
            username,
            password,
            isAdmin: false,
            preferredAuthMethod: 'otp'
          });
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
        
        // Ensure session is saved
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ message: "Error saving session" });
          }
          
          // Return user without sensitive data
          const safeUser = {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt
          };
          
          return res.json(safeUser);
        });
      });
    } catch (error) {
      console.error("Login/Registration error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/logout", (req, res) => {
    // Store session ID before logout for debugging
    const sessionId = req.sessionID;
    
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Error logging out" });
      }
      
      // Destroy session to ensure complete cleanup
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          console.error("Session destruction error:", destroyErr);
          return res.status(500).json({ message: "Error destroying session" });
        }
        
        console.log(`Session ${sessionId} destroyed successfully`);
        res.clearCookie('sessionId');
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    console.log('GET /api/auth/me - Session:', {
      id: req.sessionID,
      isAuthenticated: req.isAuthenticated(),
      session: req.session
    });

    if (!req.isAuthenticated()) {
      // Check if session exists but user is not loaded
      if (req.session?.passport?.user && !req.user) {
        console.log('Session exists but user not loaded, attempting to reload');
        return passport.authenticate('session')(req, res, () => {
          if (req.user) {
            res.json(req.user);
          } else {
            res.status(401).json({ error: "session_expired" });
          }
        });
      }
      return res.status(401).json({ error: "not_authenticated" });
    }

    res.json(req.user);
  });
}