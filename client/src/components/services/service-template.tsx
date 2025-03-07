import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

  // Ticket creation function
const createTicket = async (ticketData: any) => {
  try {
    console.log("Sending ticket data:", JSON.stringify(ticketData, null, 2)); // Debug log
    
    // Use fetch directly to have more control over error handling
    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData),
      credentials: 'include'
    });
    
    // Check if the response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      let errorMessage = `Server responded with status: ${response.status}`;
      
      try {
        // Try to parse the error as JSON
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If can't parse as JSON, use the raw text
        if (errorText) {
          errorMessage = errorText;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
};

// Interface for subcategory data
export interface SubcategoryData {
  id: string;
  name: string;
  categoryId: string; // ID of the parent category this subcategory belongs to
  serviceIds: string[]; // IDs of services linked to this subcategory
}

// Interface for service data
export interface ServiceData {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  category?: string;
  subcategoryIds?: string[]; // IDs of subcategories this service belongs to
  popular?: boolean;
  eligibility?: string[];
  process?: {
    title: string;
    steps: string[];
  }[];
  documents?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

interface ServiceTemplateProps {
  service: ServiceData;
}

export function ServiceTemplate({ service }: ServiceTemplateProps) {
  const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({});
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const queryClient = useQueryClient();
  
  const handleApplyNow = () => {
    if (user) {
      setShowConfirmDialog(true);
    } else {
      // Capture current service ID for return URL
      const returnUrl = `/service/${service.id}`;
      // Redirect to auth page with return URL
      setLocation(`/auth?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  };

  const handleContactUs = () => {
    if (service.contactInfo?.phone) {
      window.location.href = `tel:${service.contactInfo.phone}`;
    } else {
      toast({
        title: "Contact Information Not Available",
        description: "Phone number is not available for this service. Please try another contact method.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmApply = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply for a service.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setShowConfirmDialog(false);
    
    try {
      // Create ticket data
      const ticketData = {
        // Basic required fields
        "title": `${service.title} Service Request`,
        "description": `Request for ${service.title} service.`,
        
        // Include service information
        "serviceId": service.id,
        "serviceName": service.title,
        
        // User information
        "userId": user.id,
        
        // Status fields
        "status": "new",
        "priority": "medium"
      };

      // Use the createTicket function
      await createTicket(ticketData);

      // Invalidate the tickets query to force a refresh
      await queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });

      // Show success message
      toast({
        title: "Success!",
        description: "Application submitted successfully!",
      });

      // Navigate to tickets page
      setLocation('/tickets');
    } catch (error) {
      console.error('Error details:', error);
      
      // Try to present a user-friendly error message
      let errorMessage = "Failed to submit application. Please try again.";
      
      try {
        if (error instanceof Error) {
          if (error.message.includes('{') && error.message.includes('}')) {
            // Try to parse as JSON
            const errorData = JSON.parse(error.message);
            errorMessage = errorData.message || errorData.error || error.message;
          } else {
            // Use raw message
            errorMessage = error.message;
          }
        }
      } catch (e) {
        // Fallback to original error message
        errorMessage = error instanceof Error ? error.message : errorMessage;
      }
      
      toast({
        title: "Error Creating Ticket",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Additional debugging info
      console.error('Error creating ticket:', {
        originalError: error,
        parsedMessage: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      // Find the footer element
      const footer = document.querySelector('footer');
      
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // If footer is in view (or close to being in view)
        if (footerRect.top < viewportHeight) {
          // Calculate how much of the footer is visible
          const footerVisibleHeight = viewportHeight - footerRect.top;
          
          // Set the bottom position to be above the visible part of the footer
          setButtonStyle({
            bottom: `${footerVisibleHeight + 16}px` // 16px is the original bottom spacing
          });
        } else {
          // Reset to default position when footer is not in view
          setButtonStyle({
            bottom: '4rem' // 16px in rem units
          });
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      {/* Hero Section - Left aligned */}
      <div className="mb-10">
        <div className="text-6xl mb-4">{service.icon}</div>
        <h1 className="text-3xl font-bold mb-4">
          {service.title.charAt(0).toUpperCase() + service.title.slice(1)}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {service.description}
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="mb-10">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Features & Benefits Card */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Features & Benefits</h2>
              <ul className="list-disc list-inside space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="text-lg">{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Eligibility Card - Separate box */}
          {service.eligibility && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
                <ul className="list-disc list-inside space-y-2">
                  {service.eligibility.map((item, index) => (
                    <li key={index} className="text-lg">{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Process Tab */}
        <TabsContent value="process" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {service.process ? (
                <div className="space-y-8">
                  {service.process.map((phase, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">{phase.title}</h3>
                      <ol className="list-decimal list-inside space-y-2">
                        {phase.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-lg">{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg">Process information is not available for this service.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {service.documents ? (
                <>
                  <h2 className="text-2xl font-semibold mb-4">Required Documents</h2>
                  <ul className="list-disc list-inside space-y-2">
                    {service.documents.map((doc, index) => (
                      <li key={index} className="text-lg">{doc}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-lg">Document information is not available for this service.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              {service.faqs ? (
                <Accordion type="single" collapsible className="w-full">
                  {service.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-lg font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-lg">FAQs are not available for this service.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CTA Section - Text part (left-aligned) */}
      <div className="mt-10 mb-20">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-6">Our experts are ready to assist you with your {service.title.charAt(0).toUpperCase() + service.title.slice(1).toLowerCase()}.</p>
      </div>
      
      {/* Fixed CTA Buttons - Positioned above bottom nav bar without background */}
      <div className="fixed left-0 right-0 z-10 p-3" style={buttonStyle}>
        <div className="container mx-auto flex justify-center gap-3">
          <Button 
            size="sm" 
            className="w-32 shadow-md" 
            onClick={handleApplyNow}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Apply Now'}
          </Button>
          <Button 
            size="sm" 
            className="w-32 shadow-md" 
            onClick={handleContactUs}
          >
            Contact Us
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Service Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply for the {service.title} service? This will create a new ticket in your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmApply} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Confirm Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}