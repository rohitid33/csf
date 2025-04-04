import React from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';

interface GoogleLoginButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

/**
 * Google Login Button Component
 * 
 * A button that redirects users to the Google OAuth flow
 */
const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const handleGoogleLogin = () => {
    // Redirect to the Google OAuth endpoint
    window.location.href = '/api/auth/google';
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      className={`flex items-center gap-2 w-full ${className}`}
      variant={variant}
    >
      <FaGoogle className="h-4 w-4" />
      <span>Continue with Google</span>
    </Button>
  );
};

export default GoogleLoginButton;
