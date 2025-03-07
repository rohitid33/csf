import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { getAllServices } from "@/data/services-data";
import { ServiceData } from "@/components/services/service-template";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type CategoryColors = {
  [key in 'insurance' | 'loan' | 'consumer' | 'default']: string;
};

// Category name mapping
const categoryNames: { [key: string]: string } = {
  "67cb0b04ceeb4243e279e412": "Insurance",
  "67cb0b04ceeb4243e279e413": "Loan",
  "67cb0b04ceeb4243e279e414": "Consumer",
  "67cb0b04ceeb4243e279e415": "Property",
  "67cb0b04ceeb4243e279e416": "Business",
  "67cb0b04ceeb4243e279e417": "Legal",
  "default": "General"
};

export default function Services() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
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

  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Generate dynamic placeholder text
  const getPlaceholderText = () => {
    if (!searchQuery) return "Search services...";
    if (filteredServices.length === 0) return "No services found";
    if (filteredServices.length === 1) return `Found: ${filteredServices[0].title}`;
    if (filteredServices.length === 2) return `Found: ${filteredServices[0].title} and ${filteredServices[1].title}`;
    return `Found: ${filteredServices[0].title} and ${filteredServices.length - 1} more`;
  };

  // Group services by category
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    const categoryId = service.category || 'default';
    const displayName = categoryNames[categoryId] || categoryId;
    
    if (!acc[displayName]) {
      acc[displayName] = [];
    }
    acc[displayName].push({
      ...service,
      category: displayName // Update the category to use the display name
    });
    return acc;
  }, {} as Record<string, ServiceData[]>);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">All Services</h1>
        <div className="text-center py-12">Loading services...</div>
      </div>
    );
  }

  // Sort categories alphabetically
  const sortedCategories = Object.entries(servicesByCategory).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">All Services</h1>
      
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder={getPlaceholderText()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full transition-all duration-200"
          />
        </div>
      </div>
      
      <div className="space-y-12">
        {sortedCategories.map(([category, categoryServices]) => (
          <div key={category} className="space-y-6">
            <h2 className="text-2xl font-semibold capitalize mb-6">
              {category}
            </h2>
            <div className="flex flex-wrap gap-6">
              {categoryServices.map((service) => (
                <Link key={service.id} href={`/service/${service.id}`}>
                  <a className="block text-center group p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 w-[calc(20%-1.2rem)]">
                    <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-2xl transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg mb-4">
                      {service.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-700 min-h-[2.5rem]">
                      {service.title}
                    </p>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Made with ❤️ in India<br />
          © 2025 Claimsutra. All rights reserved.
        </p>
      </footer>
    </div>
  );
}