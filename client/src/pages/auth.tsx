import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuthContext } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MigrationWarning } from "@/components/MigrationWarning";
import { FaGoogle } from "react-icons/fa";

interface MigrationStatus {
  startedAt: string;
  daysRemaining: number | null;
  remindersSent: number;
  lastReminder: string | null;
  scheduledDeletionDate: string;
}

const testimonials = [
  {
    name: "Devika Mishra",
    role: "Life Insurance Claim",
    content: "Claimsutra helped me get my life insurance claim settled within weeks.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
  },
  {
    name: "Freya Goyal",
    role: "Health Insurance Dispute",
    content: "Professional team that guided me through the entire resolution process.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
  },
  {
    name: "Somya Mathur",
    role: "Policy Review",
    content: "Their expert analysis saved me from a potential claim rejection.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
  },
  {
    name: "Aditi Bajaj",
    role: "Motor Insurance Claim",
    content: "Quick resolution to my car insurance claim. Highly recommended!",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  },
];

export default function AuthPage() {
  const [_, setLocation] = useLocation();
  const { user } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus | null>(null);
  
  // Check for Google auth success/error in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleSuccess = params.get('success');
    const googleError = params.get('error');
    
    if (googleSuccess === 'google-auth-success') {
      // Refresh user data after successful Google login
      window.history.replaceState({}, document.title, '/auth');
    } else if (googleError === 'google-auth-failed') {
      setError('Google authentication failed. Please try again.');
      window.history.replaceState({}, document.title, '/auth');
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Get returnUrl from query parameters
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');
      // Redirect to returnUrl if present, otherwise go to home
      setLocation(returnUrl || "/");
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-4 md:py-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 md:mb-6">
            What Our Clients Say
          </h2>
          
          <div className="relative max-w-5xl mx-auto overflow-hidden scroll-container mb-4 md:mb-6">
            {/* Testimonials container with continuous CSS animation */}
            <div 
              className="flex gap-6 animate-scroll"
              style={{ 
                willChange: 'transform',
                width: `${testimonials.length * (320 + 24) * 2}px` // Double width for the duplicated set
              }}
            >
              {/* First set of testimonials */}
              {testimonials.map((testimonial, index) => (
                <Card key={`first-${index}`} className="flex-shrink-0 w-80 border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">{testimonial.content}</p>
                        <h3 className="font-medium text-sm text-gray-900">{testimonial.name}</h3>
                        <p className="text-xs text-primary">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Duplicate set for seamless scrolling */}
              {testimonials.map((testimonial, index) => (
                <Card key={`second-${index}`} className="flex-shrink-0 w-80 border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">{testimonial.content}</p>
                        <h3 className="font-medium text-sm text-gray-900">{testimonial.name}</h3>
                        <p className="text-xs text-primary">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Add gradient overlays for better visual effect */}
            <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-md px-4 pb-8 -mt-4 md:-mt-8">
        <Card className="border border-gray-300 shadow-lg">
          <CardHeader className="space-y-1 border-b border-gray-200 text-center">
            <CardTitle className="text-2xl font-bold">
              India's Legal Claim Expert!
            </CardTitle>
            <CardDescription className="text-base">
              Sign in with Google to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {migrationStatus && (
              <MigrationWarning 
                migrationStatus={migrationStatus}
                onSwitchToOTP={() => {
                  // Not applicable anymore
                }}
              />
            )}
            
            {/* Google Login Button */}
            <div className="py-6">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-gray-300 h-12"
                onClick={() => window.location.href = '/api/auth/google'}
              >
                <FaGoogle className="h-4 w-4 text-red-500" />
                <span>Continue with Google</span>
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              By signing in, you agree to our 
              <a href="/terms" className="text-primary hover:underline mx-1">Terms of Service</a>
              and
              <a href="/privacy" className="text-primary hover:underline mx-1">Privacy Policy</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
