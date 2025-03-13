import React, { useState, useRef, useEffect } from "react";
import { useVakilsutraData } from "@/hooks/use-vakilsutra-data";
import { Link } from "wouter";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";

// Banner content for Vakilsutra
const bannerContent = {
  title: "Legal Services & Support",
  subtitle: "Expert legal assistance for all your needs",
  image: "/banner.jpg" // Using the same banner image as home
};

export default function VakilsutraPage() {
  const { categories, isLoading, error } = useVakilsutraData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [hasAutoScrolled, setHasAutoScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const servicesContainerRef = useRef<HTMLDivElement>(null);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  // Get all services across all categories and subcategories
  const allServices = categories.flatMap(category =>
    category.subcategories.flatMap(subcategory => 
      subcategory.services.map(service => ({
        ...service,
        categoryName: category.name,
        subcategoryName: subcategory.name
      }))
    )
  );

  // Filter services based on search query
  const searchResults = searchQuery
    ? allServices.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.subcategoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Filter categories based on search query
  const filteredCategories = categories.map(category => ({
    ...category,
    subcategories: category.subcategories.map(subcategory => ({
      ...subcategory,
      services: subcategory.services.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(subcategory =>
      subcategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subcategory.services.length > 0
    )
  })).filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.subcategories.length > 0
  );

  // Auto-scroll effect for categories
  useEffect(() => {
    const initializeAutoScroll = () => {
      if (!categoriesContainerRef.current || hasAutoScrolled || isLoading || categories.length === 0) return;

      const container = categoriesContainerRef.current;
      const totalWidth = container.scrollWidth;
      const viewportWidth = container.clientWidth;
      const maxScroll = totalWidth - viewportWidth;

      if (maxScroll <= 0) return; // Don't scroll if content fits in viewport

      // Start from beginning
      container.scrollLeft = 0;

      // First timeout - start scrolling after initial delay
      setTimeout(() => {
        // Scroll to end
        container.scrollTo({
          left: maxScroll,
          behavior: 'smooth'
        });

        // Second timeout - scroll back to start after reaching end
        setTimeout(() => {
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
          setHasAutoScrolled(true);
        }, 2000); // Wait 2 seconds at the end
      }, 1000); // Wait 1 second before starting
    };

    initializeAutoScroll();
  }, [hasAutoScrolled, isLoading, categories]);

  // Reset auto-scroll when category changes or search query changes
  useEffect(() => {
    setHasAutoScrolled(false);
  }, [selectedCategory, searchQuery]);

  // Reset services scroll position when category changes
  useEffect(() => {
    if (selectedCategory && servicesContainerRef.current) {
      servicesContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [selectedCategory]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="container mx-auto px-4 py-8">
          <div className="h-12 bg-gray-200 rounded mb-8 max-w-md mx-auto"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 text-lg font-semibold">Error Loading Data</h2>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Search Section */}
      <section className="mb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for legal services..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedCategory(null); // Clear selected category when searching
                }}
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {searchQuery && (
        <section className="mb-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6 px-2">
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {searchResults.map((service) => (
                  <Link 
                    key={service.id}
                    href={`/service/${service.id}`}
                  >
                    <a className="group">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 transition-all duration-200 group-hover:scale-110 shadow-md group-hover:shadow-xl">
                          <span className="text-2xl text-primary">
                            {service.icon}
                          </span>
                        </div>
                        <div className="text-center">
                          <h3 className="font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {service.title}
                          </h3>
                          <div className="space-y-0.5">
                            <p className="text-gray-600 text-sm">{service.categoryName}</p>
                            <p className="text-gray-500 text-xs">{service.subcategoryName}</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No services found matching "{searchQuery}"</p>
                <p className="text-gray-500 text-sm mt-1">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Only show categories and services sections when not searching */}
      {!searchQuery && (
        <>
          {/* Categories Section */}
          <section className="bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-semibold mb-6 text-left">Legal Categories</h2>
              <div className="relative max-w-5xl mx-auto">
                {/* Scroll buttons */}
                <button 
                  onClick={() => {
                    if (categoriesContainerRef.current) {
                      categoriesContainerRef.current.scrollBy({
                        left: -200,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 
                            ${showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                            hidden md:flex md:items-center md:justify-center`}
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => {
                    if (categoriesContainerRef.current) {
                      categoriesContainerRef.current.scrollBy({
                        left: 200,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 
                            ${showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                            hidden md:flex md:items-center md:justify-center`}
                  aria-label="Scroll right"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Categories Horizontal Scroll */}
                <div 
                  ref={categoriesContainerRef}
                  className="overflow-x-auto scrolling-touch scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={(e) => {
                    const target = e.target as HTMLDivElement;
                    setShowLeftScroll(target.scrollLeft > 0);
                    setShowRightScroll(
                      target.scrollLeft < target.scrollWidth - target.clientWidth
                    );
                  }}
                >
                  <div className="flex gap-8 py-2 px-4 min-w-max">
                    {filteredCategories.map((category) => (
                      <button
                        key={category.id}
                        className="flex flex-col items-center min-w-[100px] transition-all"
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        )}
                      >
                        <div className={`
                          w-14 h-14 rounded-full flex items-center justify-center mb-2
                          transition-all duration-200 hover:scale-110
                          ${selectedCategory === category.id 
                            ? 'bg-primary shadow-lg shadow-primary/30' 
                            : 'bg-white hover:bg-blue-50 shadow-md'
                          }
                        `}>
                          <span className={`text-2xl ${
                            selectedCategory === category.id 
                              ? 'text-white' 
                              : 'text-primary'
                          }`}>
                            {category.icon}
                          </span>
                        </div>
                        <span className={`text-sm font-medium text-center transition-colors duration-200 ${
                          selectedCategory === category.id 
                            ? 'text-primary' 
                            : 'text-gray-600'
                        }`}>
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="pt-8 pb-8 bg-background">
            <div className="container mx-auto px-4">
              <div className="bg-blue-100/90 rounded-2xl p-6 md:p-8 shadow-lg border border-blue-200">
                {selectedCategory ? (
                  <div className="space-y-8">
                    {filteredCategories
                      .find(cat => cat.id === selectedCategory)
                      ?.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="pt-4 first:pt-0">
                          <h3 className="text-xl font-medium mb-4 text-blue-950">
                            {subcategory.name}
                          </h3>
                          {subcategory.services.length > 0 ? (
                            <div 
                              ref={servicesContainerRef}
                              className="overflow-x-auto scrolling-touch scroll-smooth"
                              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                              <div className="flex gap-8 py-2 min-w-max px-4">
                                {subcategory.services.map((service) => (
                                  <Link 
                                    key={service.id}
                                    href={`/service/${service.id}`}
                                  >
                                    <a className="flex flex-col items-center text-center cursor-pointer group min-w-[140px]">
                                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center mb-3 transition-all duration-200 group-hover:bg-blue-50 group-hover:scale-110 shadow-md group-hover:shadow-xl border border-blue-100">
                                        <span className="text-2xl text-blue-700">
                                          {service.icon}
                                        </span>
                                      </div>
                                      <h3 className="font-medium text-blue-950 line-clamp-2 group-hover:text-blue-800 transition-colors duration-200 max-w-[140px] text-sm">
                                        {service.title}
                                      </h3>
                                    </a>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-blue-700/70">
                              No services available in this category.
                            </p>
                          )}
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-blue-950">
                      {searchQuery ? 'Type to search for services...' : 'Select a category to view available services'}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
} 