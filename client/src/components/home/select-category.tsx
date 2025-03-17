import React, { useEffect, useRef, useState } from "react";
import SelectServices from "./select-services";

const categories = [
  { name: "Motor Insurance", icon: "/icons/motor.png" },
  { name: "Life Insurance", icon: "/icons/car_ins.png" },
  { name: "Health Insurance", icon: "/icons/car_ins.png" },
  { name: "Travel Insurance", icon: "/icons/car_ins.png" },
  { name: "General Insurance", icon: "/icons/car_ins.png" }
];

export default function SelectCategory() {
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
      <div 
        ref={scrollContainerRef}
        className="flex items-center justify-between gap-6 overflow-x-auto pb-4 hide-scrollbar"
      >
        {categories.map((category, index) => {
          const [firstWord, secondWord] = category.name.split(' ');
          return (
            <div 
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col items-center gap-3 min-w-[140px] cursor-pointer group ${
                selectedCategory === category.name ? 'bg-blue-50 rounded-xl p-2' : ''
              }`}
            >
              <div className={`w-16 h-16 flex items-center justify-center transition-all duration-200 group-hover:shadow-xl rounded-2xl ${
                selectedCategory === category.name ? 'bg-blue-600' : ''
              }`}>
                <img
                  src={category.icon}
                  alt={category.name}
                  className={`w-16 h-16 object-cover rounded-2xl transition-all duration-200 group-hover:shadow-lg ${
                    selectedCategory === category.name ? 'brightness-0 invert' : ''
                  }`}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-base font-medium text-blue-950 text-center group-hover:text-blue-800 transition-colors duration-200">
                  {firstWord}
                </span>
                <span className="text-base font-medium text-blue-950 text-center group-hover:text-blue-800 transition-colors duration-200">
                  {secondWord}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Display service icons using the new component */}
      {selectedCategory && <SelectServices category={selectedCategory} />}
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