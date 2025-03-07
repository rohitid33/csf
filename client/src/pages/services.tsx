import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getAllServices } from "@/data/services-data";
import { ServiceData } from "@/components/services/service-template";

export default function Services() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Get all services from our data file (now async)
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Group services by category
  const servicesByCategory = {
    insurance: services,
    loan: [],
    consumer: []
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">All Services</h1>
        <div className="text-center py-12">Loading services...</div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Services</h1>

      {/* Insurance Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Insurance Services</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicesByCategory.insurance.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">Get expert assistance with {service.title.toLowerCase()}</p>
                <Link href={`/service/${service.id}`}>
                  <Button className="w-full text-base py-6">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Loan Services - Empty in this example */}
      {servicesByCategory.loan.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Loan Services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicesByCategory.loan.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">Get expert assistance with {service.title.toLowerCase()}</p>
                  <Link href={`/service/${service.id}`}>
                    <Button className="w-full text-base py-6">Learn More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Consumer Services - Empty in this example */}
      {servicesByCategory.consumer.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Consumer Services</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicesByCategory.consumer.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">Get expert assistance with {service.title.toLowerCase()}</p>
                  <Link href={`/service/${service.id}`}>
                    <Button className="w-full text-base py-6">Learn More</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Note about dynamic services */}
      <div className="mt-12 p-6 border rounded-lg bg-muted/20">
        <h2 className="text-xl font-semibold mb-2">About Dynamic Services</h2>
        <p>
          This page now uses a dynamic service system that can handle 150+ services without creating individual pages for each service.
          Try clicking on any service to see the new template in action!
        </p>
      </div>
    </div>
  );
}