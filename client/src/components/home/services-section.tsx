import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getAllServices } from "@/data/services-data";
import { getSubcategoriesByCategoryId, SubcategoryData } from "@/data/subcategories-data";
import { ServiceData } from "@/components/services/service-template";
import { Card, CardContent } from "@/components/ui/card";

interface ServicesSectionProps {
  selectedCategory: string;
}

export default function ServicesSection({ selectedCategory }: ServicesSectionProps) {
  const [, setLocation] = useLocation();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all services
        const allServices = await getAllServices();
        console.log("All services:", allServices);
        
        // Fetch subcategories for the selected category
        const categorySubcategories = await getSubcategoriesByCategoryId(selectedCategory);
        console.log("Category subcategories:", categorySubcategories);
        
        // Filter services that belong to the selected category
        // This includes services that directly have the category or are linked through subcategories
        const categoryServices = allServices.filter(service => {
          // Check if service directly belongs to the category
          if (service.category === selectedCategory) {
            console.log(`Service ${service.id} directly belongs to category ${selectedCategory}`);
            return true;
          }
          
          // Check if service belongs to any subcategory of the selected category
          if (service.subcategoryIds && service.subcategoryIds.length > 0) {
            const belongsToSubcategory = service.subcategoryIds.some(subcatId => 
              categorySubcategories.some(subcat => subcat.id === subcatId)
            );
            
            if (belongsToSubcategory) {
              console.log(`Service ${service.id} belongs to a subcategory of ${selectedCategory}`);
              return true;
            }
          }
          
          // Also check if service ID exists in any subcategory's serviceIds
          const isInSubcategoryServices = categorySubcategories.some(subcat => 
            subcat.serviceIds && subcat.serviceIds.includes(service.id)
          );
          
          if (isInSubcategoryServices) {
            console.log(`Service ${service.id} is in serviceIds of a subcategory of ${selectedCategory}`);
            return true;
          }
          
          return false;
        });
        
        console.log("Filtered category services:", categoryServices);
        
        setServices(categoryServices);
        setSubcategories(categorySubcategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedCategory) {
      fetchData();
    }
  }, [selectedCategory]);

  const handleServiceClick = (serviceId: string) => {
    setLocation(`/service/${serviceId}`);
  };

  if (isLoading) {
    return (
      <section className="pt-2 pb-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="pt-2 pb-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No services found for this category.</p>
          </div>
        </div>
      </section>
    );
  }

  // Group services by subcategory
  const servicesBySubcategory: Record<string, ServiceData[]> = {};
  
  // Initialize with "No Subcategory" group for services without subcategory
  servicesBySubcategory["none"] = [];
  
  // Initialize arrays for each subcategory
  subcategories.forEach(subcategory => {
    servicesBySubcategory[subcategory.id] = [];
  });
  
  // Add services to their respective subcategory groups
  services.forEach(service => {
    let addedToSubcategory = false;
    
    // First check if the service has subcategoryIds
    if (service.subcategoryIds && service.subcategoryIds.length > 0) {
      // Try to match with available subcategories
      for (const subcatId of service.subcategoryIds) {
        for (const subcat of subcategories) {
          if (subcat.id === subcatId) {
            servicesBySubcategory[subcatId].push(service);
            addedToSubcategory = true;
            // Don't break here to allow a service to appear in multiple subcategories
          }
        }
      }
    }
    
    // If not added by subcategoryIds, check if service ID is in any subcategory's serviceIds
    if (!addedToSubcategory) {
      for (const subcategory of subcategories) {
        if (subcategory.serviceIds && subcategory.serviceIds.includes(service.id)) {
          servicesBySubcategory[subcategory.id].push(service);
          addedToSubcategory = true;
          // Don't break, allow service to appear in multiple subcategories if configured that way
        }
      }
    }
    
    // If still not added to any subcategory, put in "none" group
    if (!addedToSubcategory) {
      servicesBySubcategory["none"].push(service);
    }
  });

  return (
    <section className="pt-2 pb-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="bg-blue-50/80 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="space-y-8">
            {/* Services grouped by subcategory */}
            {subcategories.map(subcategory => (
              <div key={subcategory.id} className="pt-4 first:pt-0">
                <h3 className="text-xl font-medium mb-4 text-blue-900">{subcategory.name}</h3>
                {servicesBySubcategory[subcategory.id].length > 0 ? (
                  <div className="overflow-x-auto scrolling-touch">
                    <div className="flex gap-8 py-2 min-w-max">
                      {servicesBySubcategory[subcategory.id].map(service => (
                        <ServiceCard 
                          key={service.id} 
                          service={service} 
                          onClick={() => handleServiceClick(service.id)} 
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-blue-600/70">No services available in this subcategory.</p>
                )}
              </div>
            ))}
            
            {/* Services without subcategory */}
            {servicesBySubcategory["none"].length > 0 && (
              <div className="pt-4">
                <h3 className="text-xl font-medium mb-4 text-blue-900">Other Services</h3>
                <div className="overflow-x-auto scrolling-touch">
                  <div className="flex gap-8 py-2 min-w-max">
                    {servicesBySubcategory["none"].map(service => (
                      <ServiceCard 
                        key={service.id} 
                        service={service} 
                        onClick={() => handleServiceClick(service.id)} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Service Card Component
interface ServiceCardProps {
  service: ServiceData;
  onClick: () => void;
}

function ServiceCard({ service, onClick }: ServiceCardProps) {
  return (
    <div 
      className="flex flex-col items-center text-center cursor-pointer group" 
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-2 transition-all duration-200 group-hover:bg-blue-100 group-hover:scale-110 shadow-sm">
        <div className="text-2xl text-blue-600">{service.icon}</div>
      </div>
      <h3 className="font-medium text-blue-900 line-clamp-2 group-hover:text-blue-700 transition-colors duration-200 max-w-[120px] text-sm">
        {service.title}
      </h3>
    </div>
  );
}