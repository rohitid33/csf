import { useEffect, useState, useRef } from "react";
import { Building2, PiggyBank, ShieldAlert, Briefcase, Home, FileText, CircleDot, ChevronRight, ChevronLeft } from "lucide-react";
import { getAllCategories, CategoryData, subscribeToCategories } from "@/data/categories-data";

interface CategoriesProps {
  selected: string;
  onSelect: (category: string) => void;
}

// Map of emoji icons to Lucide icons
const iconMap: Record<string, JSX.Element> = {
  "🔒": <ShieldAlert size={24} />,
  "💰": <PiggyBank size={24} />,
  "🛒": <Building2 size={24} />,
  "™️": <FileText size={24} />,
  "🏢": <Briefcase size={24} />,
  "🏠": <Home size={24} />,
  "📄": <CircleDot size={24} />
};

// Consistent background and text colors for all icons
const defaultIconBgColor = "bg-blue-100";
const defaultIconTextColor = "text-blue-600";
const selectedIconBgColor = "bg-primary";
const selectedIconTextColor = "text-primary-foreground";

// Function to render icon (either Lucide icon or emoji)
const renderIcon = (icon: string) => {
  return iconMap[icon] || <span className="text-2xl">{icon}</span>;
};

export default function Categories({ selected, onSelect }: CategoriesProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  
  // Add auto-scroll effect for mobile
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    // Only run on mobile devices
    if (window.innerWidth <= 768) {
      // Initial scroll to show full scroll capability
      setTimeout(() => {
        // First scroll to the end
        const scrollToEnd = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        scrollContainer.scrollBy({ left: scrollToEnd, behavior: 'smooth' });
        
        // Then scroll back to start after a delay
        setTimeout(() => {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }, 1000);
      }, 1000);
    }
  }, [categories]);

  // Fetch and sort categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const loadedCategories = await getAllCategories();
        
        // Sort categories by their number field (ascending)
        const sortedCategories = [...loadedCategories].sort((a, b) => {
          return (a.number || 0) - (b.number || 0);
        });
        
        setCategories(sortedCategories);
        
        // If there are categories and none is selected, select the first one
        if (sortedCategories.length > 0 && (!selected || !sortedCategories.find(cat => cat.id === selected))) {
          onSelect(sortedCategories[0].id);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
    
    // Subscribe to category changes
    const unsubscribe = subscribeToCategories(() => {
      fetchCategories();
    });
    
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [onSelect, selected]);
  
  // Check scroll position to determine if scroll buttons should be visible
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };
  
  // Initialize scroll check and add scroll event listener
  useEffect(() => {
    checkScrollPosition();
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      
      // Recheck when window resizes
      window.addEventListener('resize', checkScrollPosition);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [categories]);
  
  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };
  
  // If no categories are loaded yet, show loading state
  if (isLoading) {
    return (
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Loading categories...</h2>
        </div>
      </section>
    );
  }
  
  if (categories.length === 0 && !isLoading) {
    return (
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-center">No categories found</h2>
          <p className="text-center text-muted-foreground">Please add categories from the admin dashboard.</p>
        </div>
      </section>
    );
  }

  // Function to format category name with second word on new line
  const formatCategoryName = (name: string) => {
    const words = name.split(" ");
    if (words.length <= 1) {
      return name;
    }
    
    return (
      <>
        <div>{words[0]}</div>
        <div>{words.slice(1).join(" ")}</div>
      </>
    );
  };

  return (
    <section id="categories-section" className="py-8 bg-background relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6 text-left">Select your category</h2>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Scroll buttons - only visible on larger screens and when needed */}
          <button 
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 
                      ${showLeftScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                      hidden md:flex md:items-center md:justify-center`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 
                      ${showRightScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'} 
                      hidden md:flex md:items-center md:justify-center`}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Add right peek gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
          
          {/* Scrollable category container */}
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 md:space-x-6 overflow-x-auto scrolling-touch pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              paddingRight: '48px' // Add padding to show peek
            }}
          >
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className="snap-start snap-always flex-shrink-0"
                style={{ 
                  width: 'calc(33.333% - 16px)',
                  minWidth: '110px',
                  maxWidth: '150px'
                }}
              >
                <button
                  onClick={() => onSelect(category.id)}
                  className="flex flex-col items-center justify-center gap-2 md:gap-3 w-full"
                >
                  <div className={`p-2 md:p-4 rounded-xl transition-colors w-12 h-12 md:w-16 md:h-16 flex items-center justify-center ${
                    selected === category.id
                      ? `${selectedIconBgColor} ${selectedIconTextColor}`
                      : `${defaultIconBgColor} ${defaultIconTextColor}`
                  }`}>
                    {renderIcon(category.icon)}
                  </div>
                  <div className="text-sm md:text-lg font-bold text-center min-h-[45px] md:min-h-[55px] flex flex-col items-center justify-center">
                    {formatCategoryName(category.name)}
                  </div>
                </button>
              </div>
            ))}
          </div>
          
          {/* Peek and sneak indicator for mobile */}
          <div className="flex justify-center mt-4 space-x-1 md:hidden">
            {categories.map((category, index) => (
              <div 
                key={`indicator-${category.id}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  selected === category.id ? 'w-4 bg-primary' : 'w-1 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}