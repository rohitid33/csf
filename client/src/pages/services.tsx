import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAllCategories } from "@/data/categories-data";
import { CategoryData } from "@/data/categories-data";
import { getAllServices } from "@/data/services-data";
import { getSubcategoriesByCategoryId } from "@/data/subcategories-data";
import { ServiceData } from "@/components/services/service-template";
import { useLocation } from "wouter";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [services, setServices] = useState<ServiceData[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const fetchedCategories = await getAllCategories();
        // Filter categories with vakilsutra tag
        const vakilsutraCategories = fetchedCategories.filter(category => 
          category.tags?.includes('vakilsutra')
        );
        setCategories(vakilsutraCategories);
        
        // Select first category by default
        if (vakilsutraCategories.length > 0) {
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
      if (!selectedCategory) return;

      try {
        const allServices = await getAllServices();
        const categorySubcategories = await getSubcategoriesByCategoryId(selectedCategory);
        
        // Filter services that belong to the selected category
        const categoryServices = allServices.filter(service => {
          // Check if service directly belongs to the category
          if (service.category === selectedCategory) {
            return true;
          }
          
          // Check if service belongs to any subcategory of the selected category
          if (service.subcategoryIds && service.subcategoryIds.length > 0) {
            return service.subcategoryIds.some(subcatId => 
              categorySubcategories.some(subcat => subcat.id === subcatId)
            );
          }
          
          // Check if service ID exists in any subcategory's serviceIds
          return categorySubcategories.some(subcat => 
            subcat.serviceIds && subcat.serviceIds.includes(service.id)
          );
        });
        
        setServices(categoryServices);
        setSubcategories(categorySubcategories);
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
            <div className="flex flex-col overflow-x-auto scrolling-touch pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* First row */}
              <div className="flex space-x-2">
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
                    <div className="text-center">
                      {category.name === 'Motor Insurance' ? (
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-xl bg-blue-100 flex items-center justify-center p-2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <img 
                            src="/icons/car_ins.png" 
                            alt="Motor Insurance" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-xl bg-blue-100 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <div className="text-2xl md:text-3xl text-blue-600">{category.icon}</div>
                        </div>
                      )}
                      <h3 className="text-sm md:text-base font-bold text-center min-h-[35px] md:min-h-[40px] flex flex-col items-center justify-center">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second row */}
              <div className="flex space-x-2">
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
                    <div className="text-center">
                      {category.name === 'Motor Insurance' ? (
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-xl bg-blue-100 flex items-center justify-center p-2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <img 
                            src="/icons/car_ins.png" 
                            alt="Motor Insurance" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div 
                          className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-xl bg-blue-100 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                            selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <div className="text-2xl md:text-3xl text-blue-600">{category.icon}</div>
                        </div>
                      )}
                      <h3 className="text-sm md:text-base font-bold text-center min-h-[35px] md:min-h-[40px] flex flex-col items-center justify-center">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Display Box */}
            {selectedCategory && (
              <div className="mt-8">
                <div className="bg-blue-100/90 rounded-2xl p-6 md:p-8 shadow-lg border border-blue-200">
                  <div className="space-y-8">
                    {/* Services grouped by subcategory */}
                    {subcategories.map(subcategory => (
                      <div key={subcategory.id} className="pt-4 first:pt-0">
                        <h3 className="text-xl font-medium mb-4 text-blue-950">{subcategory.name}</h3>
                        {services.filter(service => 
                          service.subcategoryIds?.includes(subcategory.id) || 
                          subcategory.serviceIds?.includes(service.id)
                        ).length > 0 ? (
                          <div className="overflow-x-auto scrolling-touch">
                            <div className="flex gap-8 py-2 min-w-max">
                              {services
                                .filter(service => 
                                  service.subcategoryIds?.includes(subcategory.id) || 
                                  subcategory.serviceIds?.includes(service.id)
                                )
                                .map(service => (
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
                        ) : (
                          <p className="text-blue-700/70">No services available in this subcategory.</p>
                        )}
                      </div>
                    ))}
                    
                    {/* Services without subcategory */}
                    {services.filter(service => 
                      !service.subcategoryIds?.length && 
                      !subcategories.some(subcat => subcat.serviceIds?.includes(service.id))
                    ).length > 0 && (
                      <div className="pt-4">
                        <h3 className="text-xl font-medium mb-4 text-blue-950">Other Services</h3>
                        <div className="overflow-x-auto scrolling-touch">
                          <div className="flex gap-8 py-2 min-w-max">
                            {services
                              .filter(service => 
                                !service.subcategoryIds?.length && 
                                !subcategories.some(subcat => subcat.serviceIds?.includes(service.id))
                              )
                              .map(service => (
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
                    )}
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