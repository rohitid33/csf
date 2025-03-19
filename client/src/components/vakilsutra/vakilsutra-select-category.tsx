import React, { useEffect, useRef, useState } from "react";
import VakilsutraSelectServices from "./vakilsutra-select-services";

interface VakilsutraSelectCategoryProps {
  searchQuery?: string;
}

const legalCategories = [
  {
    name: "Trademark & IP",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/trademarkip"
  },
  {
    name: "Consumer Claim",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/civil-law"
  },
  {
    name: "Family Law",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/family-law"
  },
  {
    name: "Property Law",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/property-law"
  },
  {
    name: "Corporate Law",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/corporate-law"
  }
];

export default function VakilsutraSelectCategory({ searchQuery = "" }: VakilsutraSelectCategoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!hasScrolled.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      // Only scroll if content is wider than container
      if (scrollWidth > clientWidth) {
        // Scroll to the end
        container.scrollTo({
          left: scrollWidth - clientWidth,
          behavior: 'smooth'
        });
        
        // After scrolling back to start
        setTimeout(() => {
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        }, 1000);
      }
      
      hasScrolled.current = true;
    }
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  // Filter categories based on search query
  const filteredCategories = legalCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
      <h2 className="text-2xl font-semibold text-blue-950 mb-6">Select Your Category</h2>
      <div 
        ref={scrollContainerRef}
        className="flex items-center justify-between gap-6 overflow-x-auto pb-4 hide-scrollbar"
      >
        {filteredCategories.map((category, index) => (
          <div 
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className={`flex flex-col items-center gap-3 min-w-[140px] cursor-pointer group ${
              selectedCategory === category.name ? 'bg-blue-50 rounded-xl p-2' : ''
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100 shadow-md group-hover:shadow-xl border border-blue-100">
              <img
                src={category.icon}
                alt={category.name}
                className="w-12 h-12 object-contain"
              />
            </div>
            <span className="text-base font-medium text-blue-950 text-center group-hover:text-blue-800 transition-colors duration-200">
              {category.name}
            </span>
          </div>
        ))}
      </div>

      {/* Display service icons when a category is selected */}
      {selectedCategory && <VakilsutraSelectServices category={selectedCategory} searchQuery={searchQuery} />}
    </div>
  );
}

// Add CSS for hiding scrollbars
const style = `
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
  }
`;

// Add style to the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = style;
  document.head.appendChild(styleElement);
} 