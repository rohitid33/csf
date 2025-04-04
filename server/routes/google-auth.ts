import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env';
import User from '../models/User';

const router = Router();

// Initiate Google OAuth authentication
router.get('/', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  // Allow users to select a different Google account each time
  prompt: 'select_account'
}));

// Google OAuth callback
router.get('/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth?error=google-auth-failed',
    session: true
  }),
  async (req, res) => {
    // Update last login and device info
    if (req.user && req.user.id) {
      try {
        // Update user's last login time and save to MongoDB
        await User.findByIdAndUpdate(req.user.id, {
          $set: {
            lastLogin: new Date(),
            preferredAuthMethod: 'google'
          }
        });
        
        // Ensure session is saved properly
        req.session.save((err) => {
          if (err) {
            console.error('Error saving session after Google login:', err);
          }
          // Safe to use req.user here since we've checked it exists above
          console.log('Google authentication successful for user:', req.user?.id);
          console.log('Session saved successfully:', req.sessionID);
          
          // Redirect to frontend after successful authentication
          res.redirect('/auth?success=google-auth-success');
        });
      } catch (error) {
        console.error('Error updating user after Google login:', error);
        res.redirect('/auth?error=google-auth-db-error');
      }
    } else {
      console.error('User object missing in request after Google authentication');
      res.redirect('/auth?error=google-auth-user-missing');
    }
  }
);

// Get current user's Google connection status
router.get('/status', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ 
      connected: false,
      message: 'Not authenticated' 
    });
  }
  
  const isGoogleConnected = req.user.googleId ? true : false;
  const preferredAuthMethod = req.user.preferredAuthMethod;
  
  res.json({
    connected: isGoogleConnected,
    preferredAuthMethod,
    username: req.user.username,
    displayName: req.user.displayName,
    profilePicture: req.user.profilePicture
  });
});

// Disconnect Google account (doesn't delete the user account)
router.post('/disconnect', async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    // Only allow disconnecting if user has another authentication method
    if (req.user.preferredAuthMethod === 'google') {
      return res.status(400).json({ 
        message: 'Cannot disconnect Google account when it is your only authentication method' 
      });
    }
    
    // Update user to remove Google connection
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { googleId: 1 },
      $set: { preferredAuthMethod: 'otp' } // Default back to OTP
    });
    
    // Update the session with the changes
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session after Google disconnect:', err);
        return res.status(500).json({ message: 'Failed to update session' });
      }
      
      res.json({ 
        success: true, 
        message: 'Google account disconnected successfully',
        preferredAuthMethod: 'otp'
      });
    });
  } catch (error) {
    console.error('Error disconnecting Google account:', error);
    res.status(500).json({ message: 'Failed to disconnect Google account' });
  }
});

export default router;
