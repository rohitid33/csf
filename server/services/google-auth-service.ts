import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import User, { IUser } from '../models/User';
import { env } from '../config/env';
import mongoose from 'mongoose';

/**
 * Google Authentication Service
 * Handles Google OAuth authentication strategy and user management
 * Following Single Responsibility Principle by focusing only on Google authentication
 */
class GoogleAuthService {
  /**
   * Initialize Google authentication strategy
   */
  initialize() {
    if (!env.auth.google.clientID || !env.auth.google.clientSecret) {
      console.warn('Google OAuth credentials not configured. Google authentication will not work.');
      return;
    }

    passport.use(
      new GoogleStrategy(
        {
          clientID: env.auth.google.clientID,
          clientSecret: env.auth.google.clientSecret,
          callbackURL: `${env.auth.google.callbackBaseURL}/api/auth/google/callback`,
          scope: ['profile', 'email'],
          passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            // Extract email from profile
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            
            if (!email) {
              return done(new Error('No email found in Google profile'), undefined);
            }

            // Check if user exists with this email
            let user: IUser | null = await User.findOne({ username: email });
            
            if (user) {
              // User exists, update Google profile info
              const updates = {
                googleId: profile.id,
                preferredAuthMethod: 'google',
                displayName: profile.displayName || user.displayName || email.split('@')[0],
                profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : user.profilePicture,
                lastLogin: new Date()
              };
              
              // Update user in database
              user = await User.findByIdAndUpdate(
                user._id,
                { $set: updates },
                { new: true } // Return the updated document
              );
              
              if (!user) {
                return done(new Error('Failed to update user after Google login'), undefined);
              }
            } else {
              // Create new user with Google profile
              user = await User.create({
                username: email,
                googleId: profile.id,
                preferredAuthMethod: 'google',
                displayName: profile.displayName || email.split('@')[0],
                profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                isAdmin: false,
                lastLogin: new Date()
              });
            }
            
            // Get the user ID as a string
            const userId = user._id instanceof mongoose.Types.ObjectId 
              ? user._id.toString() 
              : typeof user._id === 'string' 
                ? user._id 
                : String(user._id);
            
            // Ensure the user object has the required fields for the User type
            const safeUser = {
              id: userId,
              username: user.username,
              preferredAuthMethod: user.preferredAuthMethod,
              googleId: user.googleId,
              displayName: user.displayName,
              profilePicture: user.profilePicture,
              isAdmin: user.isAdmin || false,
              createdAt: user.createdAt instanceof Date 
                ? user.createdAt.toISOString() 
                : new Date().toISOString()
            };
            
            // If there's an existing session, save it to ensure consistency
            if (req.session) {
              req.session.touch();
              req.session.save();
            }
            
            return done(null, safeUser);
          } catch (error) {
            console.error('Google authentication error:', error);
            return done(error, undefined);
          }
        }
      )
    );
  }
}

export const googleAuthService = new GoogleAuthService();
