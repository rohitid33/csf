import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User';

// Force load from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

// Log configuration details for debugging
console.log('==== GOOGLE AUTH CONFIGURATION ====');
console.log(`GOOGLE_CLIENT_ID exists: ${Boolean(process.env.GOOGLE_CLIENT_ID)}`);
console.log(`GOOGLE_CLIENT_SECRET exists: ${Boolean(process.env.GOOGLE_CLIENT_SECRET)}`);
console.log(`GOOGLE_CALLBACK_BASE_URL: ${process.env.GOOGLE_CALLBACK_BASE_URL || 'http://localhost:3000'}`);

// Export a function to set up the Google strategy
export function setupGoogleStrategy() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = `${process.env.GOOGLE_CALLBACK_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`;
  
  if (!clientID || !clientSecret) {
    console.error('ERROR: Google OAuth credentials missing! Authentication will not work.');
    console.error('Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in .env file');
    // Continue anyway to prevent app crash
  }
  
  try {
    // Register the Google strategy with Passport
    passport.use(
      new GoogleStrategy(
        {
          clientID: clientID || 'missing-client-id',
          clientSecret: clientSecret || 'missing-client-secret',
          callbackURL,
          scope: ['profile', 'email'],
        },
        // This callback will be called when a user is authenticated with Google
        async (accessToken, refreshToken, profile: Profile, done) => {
          try {
            // Log profile details for debugging
            const email = profile.emails?.[0]?.value;
            console.log('Google auth callback triggered. Email:', email || 'No email found');
            
            if (!email) {
              console.error('No email found in Google profile');
              return done(new Error('No email found in Google profile'), false);
            }
            
            // Find or create user in our database
            let user = await User.findOne({ username: email });
            
            if (user) {
              // Update existing user
              console.log(`Updating existing user with email ${email}`);
              user.googleId = profile.id;
              user.preferredAuthMethod = 'google';
              user.displayName = profile.displayName || user.displayName;
              user.profilePicture = profile.photos?.[0]?.value || user.profilePicture;
              await user.save();
            } else {
              // Create new user
              console.log(`Creating new user with email ${email}`);
              user = await User.create({
                username: email,
                googleId: profile.id,
                preferredAuthMethod: 'google',
                displayName: profile.displayName || email.split('@')[0],
                profilePicture: profile.photos?.[0]?.value || null,
                isAdmin: false
              });
            }
            
            if (!user) {
              return done(new Error('Failed to create or find user'), false);
            }
            
            // Convert to session-friendly object
            const userForSession = {
              id: String(user._id),
              username: user.username,
              preferredAuthMethod: user.preferredAuthMethod,
              googleId: user.googleId,
              displayName: user.displayName,
              profilePicture: user.profilePicture,
              isAdmin: user.isAdmin || false
            };
            
            console.log('Google authentication successful, userForSession:', userForSession);
            return done(null, userForSession);
          } catch (error) {
            console.error('Error in Google strategy callback:', error);
            return done(error as Error, false);
          }
        }
      )
    );
    console.log('Google authentication strategy registered successfully!');
  } catch (error) {
    console.error('Failed to register Google strategy:', error);
  }
}
