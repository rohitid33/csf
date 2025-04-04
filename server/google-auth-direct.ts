import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from './models/User';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Force load direct from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

/**
 * Direct Google OAuth implementation following Single Responsibility Principle
 * This file only handles Google authentication configuration
 */
export function setupGoogleAuth() {
  console.log('==== DIRECT GOOGLE AUTH SETUP - STARTING ====');
  
  // Get credentials directly from process.env
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackBaseURL = process.env.GOOGLE_CALLBACK_BASE_URL || 'http://localhost:3000';
  const callbackURL = `${callbackBaseURL}/api/auth/google/callback`;
  
  console.log('Google OAuth credentials check:');
  console.log(`- Client ID exists: ${Boolean(clientID)}`);
  console.log(`- Client Secret exists: ${Boolean(clientSecret)}`);
  console.log(`- Callback URL: ${callbackURL}`);
  
  if (!clientID || !clientSecret) {
    console.error('ERROR: Google OAuth credentials not configured!');
    console.error('Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in your .env file');
    return;
  }
  
  // Register Google strategy with Passport
  try {
    passport.use(
      'google',
      new GoogleStrategy(
        {
          clientID,
          clientSecret,
          callbackURL,
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          console.log('Google authentication callback triggered');
          try {
            // Extract email from profile
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            
            if (!email) {
              console.error('No email found in Google profile');
              return done(new Error('No email found in Google profile'), undefined);
            }

            console.log(`Processing Google auth for email: ${email}`);
            
            // Find or create user
            let user: IUser | null = await User.findOne({ username: email });
            
            if (user) {
              // Update existing user
              console.log(`Updating existing user with email ${email}`);
              user.googleId = profile.id;
              user.preferredAuthMethod = 'google';
              user.displayName = profile.displayName || user.displayName;
              user.profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : user.profilePicture;
              await user.save();
            } else {
              // Create new user
              console.log(`Creating new user with email ${email}`);
              user = await User.create({
                username: email,
                googleId: profile.id,
                preferredAuthMethod: 'google',
                displayName: profile.displayName || email.split('@')[0],
                profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                isAdmin: false
              });
            }
            
            if (!user) {
              return done(new Error('Failed to create or find user'), undefined);
            }
            
            // Get the ID safely
            const userId = user._id instanceof mongoose.Types.ObjectId 
              ? user._id.toString() 
              : String(user._id);
            
            // Convert user to simple object for session
            const userForSession = {
              id: userId,
              username: user.username,
              preferredAuthMethod: user.preferredAuthMethod,
              googleId: user.googleId,
              displayName: user.displayName,
              profilePicture: user.profilePicture,
              isAdmin: user.isAdmin || false
            };
            
            console.log('Google authentication successful', userForSession);
            return done(null, userForSession);
          } catch (error) {
            console.error('Google auth error:', error);
            return done(error, undefined);
          }
        }
      )
    );
    console.log('==== DIRECT GOOGLE AUTH SETUP - COMPLETED SUCCESSFULLY ====');
  } catch (error) {
    console.error('==== DIRECT GOOGLE AUTH SETUP - FAILED ====', error);
  }
}
