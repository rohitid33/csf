import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from './models/User';
import { env } from './config/env';
import mongoose from 'mongoose';

// Configure Google Strategy
export const setupGoogleStrategy = () => {
  console.log('Setting up Google authentication strategy');
  
  if (!env.auth.google.clientID || !env.auth.google.clientSecret) {
    console.warn('Google OAuth credentials not configured. Google authentication will not work.');
    return;
  }

  // Register Google strategy with Passport
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.auth.google.clientID,
        clientSecret: env.auth.google.clientSecret,
        callbackURL: `${env.auth.google.callbackBaseURL}/api/auth/google/callback`,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract email from profile
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          
          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          console.log(`Processing Google login for email: ${email}`);
          
          // Check if user exists with this email
          let user: IUser | null = await User.findOne({ username: email });
          
          if (user) {
            // User exists, update Google profile info if needed
            console.log(`Existing user found for email: ${email}`);
            user.googleId = profile.id;
            user.preferredAuthMethod = 'google';
            user.displayName = profile.displayName || user.displayName;
            user.profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : user.profilePicture;
            await user.save();
          } else {
            // Create new user with Google profile
            console.log(`Creating new user for email: ${email}`);
            user = await User.create({
              username: email,
              googleId: profile.id,
              preferredAuthMethod: 'google',
              displayName: profile.displayName || email.split('@')[0],
              profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
              isAdmin: false
            });
          }
          
          // Ensure we have a valid user object
          if (!user) {
            return done(new Error('Failed to create or retrieve user'), undefined);
          }
          
          // Get the user ID as a string
          const userId = user._id instanceof mongoose.Types.ObjectId 
            ? user._id.toString() 
            : String(user._id);
          
          const userObject = {
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
          
          console.log('Google authentication successful:', userObject.username);
          return done(null, userObject);
        } catch (error) {
          console.error('Google authentication error:', error);
          return done(error, undefined);
        }
      }
    )
  );
  
  console.log('Google authentication strategy registered successfully');
};
