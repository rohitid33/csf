import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAllCategories } from "@/data/categories-data";
import { CategoryData } from "@/data/categories-data";
import { getAllServices } from "@/data/services-data";
import { getSubcategoriesByCategoryId } from "@/data/subcategories-data";
import { ServiceData, SubcategoryData } from "@/components/services/service-template";
import { useLocation } from "wouter";

// Add these constants at the top level of the file, after the imports
const defaultIconBgColor = "bg-blue-100";
const defaultIconTextColor = "text-blue-600";
const selectedIconBgColor = "bg-primary";
const selectedIconTextColor = "text-primary-foreground";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [services, setServices] = useState<ServiceData[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryData[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories...');
        const fetchedCategories = await getAllCategories();
        console.log('All fetched categories:', fetchedCategories);
        
        // Filter categories with vakilsutra tag
        const vakilsutraCategories = fetchedCategories.filter(category => 
          category.tags?.includes('vakilsutra')
        );
        console.log('Filtered vakilsutra categories:', vakilsutraCategories);
        setCategories(vakilsutraCategories);
        
        // Select first category by default
        if (vakilsutraCategories.length > 0) {
          console.log('Setting default category:', vakilsutraCategories[0]);
          setSelectedCategory(vakilsutraCategories[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedCategory) {
        console.log('No category selected, skipping service fetch');
        return;
      }

      try {
        console.log('\n=== Fetching Services for Category ===');
        console.log('Selected Category:', selectedCategory);
        
        // Fetch all services
        const allServices = await getAllServices();
        console.log('\n=== All Services ===');
        console.log('Count:', allServices.length);
        
        // Fetch subcategories for the selected category
        const categorySubcategories = await getSubcategoriesByCategoryId(selectedCategory);
        console.log('\n=== Category Subcategories ===');
        console.log('Count:', categorySubcategories.length);
        console.log('Subcategories:', categorySubcategories.map(sc => ({ id: sc.id, name: sc.name, serviceIds: sc.serviceIds })));

        // Filter services that belong to the selected category
        const categoryServices = allServices.filter(service => {
          console.log("Checking service:", service.id);
          
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

        console.log('\n=== Final Results ===');
        console.log('Filtered Services Count:', categoryServices.length);
        console.log('Service IDs:', categoryServices.map(s => s.id));
        
        // Sort subcategories by their order if available
        const sortedSubcategories = [...categorySubcategories].sort((a, b) => {
          // Cast to any since order is optional and might not exist in some data
          const orderA = (a as any).order ?? 0;
          const orderB = (b as any).order ?? 0;
          return orderA - orderB;
        });
        
        setServices(categoryServices);
        setSubcategories(sortedSubcategories);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
        setSubcategories([]);
      }
    };

    fetchServices();
  }, [selectedCategory]);

  const handleServiceClick = (serviceId: string) => {
    setLocation(`/service/${serviceId}`);
  };

  // Function to get services for a subcategory
  const getServicesForSubcategory = (subcategory: SubcategoryData): ServiceData[] => {
    const subcategoryServices = services.filter(service => {
      // Check if service belongs to this subcategory through subcategoryIds
      if (service.subcategoryIds?.includes(subcategory.id)) {
        return true;
      }
      
      // Check if service belongs to this subcategory through serviceIds
      return subcategory.serviceIds?.includes(service.id) || false;
    });

    return subcategoryServices;
  };

  // Function to get services without any subcategory
  const getServicesWithoutSubcategory = (): ServiceData[] => {
    return services.filter(service => {
      // If service has no subcategoryIds and isn't in any subcategory's serviceIds
      const hasNoSubcategoryIds = !service.subcategoryIds || service.subcategoryIds.length === 0;
      const notInAnySubcategoryServices = !subcategories.some(
        subcat => subcat.serviceIds?.includes(service.id)
      );
      
      return hasNoSubcategoryIds && notInAnySubcategoryServices;
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">All Services</h1>
      
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full transition-all duration-200"
          />
        </div>
      </div>

      {/* Select your category section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6">Select your category</h2>
        {loading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="relative max-w-5xl mx-auto">
            <div className="flex flex-col md:justify-center overflow-x-auto scrolling-touch pt-2 pb-6 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* First row */}
              <div className="flex space-x-4 md:space-x-8 mb-6 md:justify-center">
                {categories.slice(0, Math.ceil(categories.length / 2)).map((category) => (
                  <div
                    key={category.id}
                    className="snap-start snap-always flex-shrink-0"
                    style={{ 
                      width: 'calc(33.333% - 8px)',
                      minWidth: '110px',
                      maxWidth: '140px'
                    }}
                  >
                    <div className="text-center py-1">
                      {category.name === 'Motor Insurance' ? (
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedCategory === category.id 
                              ? `${selectedIconBgColor} ${selectedIconTextColor}`
                              : `${defaultIconBgColor} ${defaultIconTextColor}`
                          }`}
                          onClick={() => {
                            console.log('Motor Insurance clicked');
                            setSelectedCategory(category.id);
                          }}
                        >
                          <div className="text-2xl md:text-3xl">{category.icon}</div>
                        </div>
                      ) : (
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedCategory === category.id 
                              ? `${selectedIconBgColor} ${selectedIconTextColor}`
                              : `${defaultIconBgColor} ${defaultIconTextColor}`
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <div className="text-2xl md:text-3xl">{category.icon}</div>
                        </div>
                      )}
                      <h3 className="text-sm md:text-base font-bold text-center min-h-[42px] md:min-h-[48px] flex flex-col items-center justify-center px-2">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second row */}
              <div className="flex space-x-4 md:space-x-8 md:justify-center">
                {categories.slice(Math.ceil(categories.length / 2)).map((category) => (
                  <div
                    key={category.id}
                    className="snap-start snap-always flex-shrink-0"
                    style={{ 
                      width: 'calc(33.333% - 8px)',
                      minWidth: '110px',
                      maxWidth: '140px'
                    }}
                  >
                    <div className="text-center py-1">
                      {category.name === 'Motor Insurance' ? (
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedCategory === category.id 
                              ? `${selectedIconBgColor} ${selectedIconTextColor}`
                              : `${defaultIconBgColor} ${defaultIconTextColor}`
                          }`}
                          onClick={() => {
                            console.log('Motor Insurance clicked');
                            setSelectedCategory(category.id);
                          }}
                        >
                          <div className="text-2xl md:text-3xl">{category.icon}</div>
                        </div>
                      ) : (
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedCategory === category.id 
                              ? `${selectedIconBgColor} ${selectedIconTextColor}`
                              : `${defaultIconBgColor} ${defaultIconTextColor}`
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <div className="text-2xl md:text-3xl">{category.icon}</div>
                        </div>
                      )}
                      <h3 className="text-sm md:text-base font-bold text-center min-h-[42px] md:min-h-[48px] flex flex-col items-center justify-center px-2">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Display Box */}
            {selectedCategory && services.length > 0 && (
              <div className="mt-8">
                <div className="bg-blue-100/90 rounded-2xl p-6 md:p-8 shadow-lg border border-blue-200">
                  <div className="space-y-8">
                    {/* Services grouped by subcategory */}
                    {subcategories.map(subcategory => {
                      const subcategoryServices = getServicesForSubcategory(subcategory);
                      if (subcategoryServices.length === 0) return null;
                      
                      return (
                        <div key={subcategory.id} className="pt-4 first:pt-0">
                          <h3 className="text-xl font-medium mb-4 text-blue-950">{subcategory.name}</h3>
                          <div className="overflow-x-auto scrolling-touch">
                            <div className="flex gap-8 py-2 min-w-max">
                              {subcategoryServices.map(service => (
                                <div 
                                  key={service.id}
                                  className="flex flex-col items-center text-center cursor-pointer group"
                                  onClick={() => handleServiceClick(service.id)}
                                >
                                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-3 transition-all duration-200 group-hover:bg-blue-50 group-hover:scale-110 shadow-md group-hover:shadow-xl border border-blue-100">
                                    <div className="text-2xl text-blue-700">{service.icon}</div>
                                  </div>
                                  <h3 className="font-medium text-blue-950 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200 max-w-[140px] text-sm">
                                    {service.title}
                                  </h3>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Services without subcategory */}
                    {(() => {
                      const servicesWithoutSubcategory = getServicesWithoutSubcategory();
                      if (servicesWithoutSubcategory.length === 0) return null;
                      
                      return (
                        <div className="pt-4">
                          <h3 className="text-xl font-medium mb-4 text-blue-950">Other Services</h3>
                          <div className="overflow-x-auto scrolling-touch">
                            <div className="flex gap-8 py-2 min-w-max">
                              {servicesWithoutSubcategory.map(service => (
                                <div 
                                  key={service.id}
                                  className="flex flex-col items-center text-center cursor-pointer group"
                                  onClick={() => handleServiceClick(service.id)}
                                >
                                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-3 transition-all duration-200 group-hover:bg-blue-50 group-hover:scale-110 shadow-md group-hover:shadow-xl border border-blue-100">
                                    <div className="text-2xl text-blue-700">{service.icon}</div>
                                  </div>
                                  <h3 className="font-medium text-blue-950 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200 max-w-[140px] text-sm">
                                    {service.title}
                                  </h3>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No categories found with the vakilsutra tag.
          </div>
        )}
      </div>
    </div>
  );
}