import React, { useEffect, useRef, useState } from "react";
import VakilsutraSelectServices from "./vakilsutra-select-services";
import VakilsutraPopularServices from "./vakilsutra-popular-services";
import VakilsutraAdCampaign from "./vakilsutra-ad-campaign";

interface VakilsutraSelectCategoryProps {
  searchQuery?: string;
}

const legalCategories = [
  {
    name: "Consumer Complaint",
    icon: "/icons/motor.png",
    url: "/vakilsutra/consumer"
  },
  {
    name: "Intellectual Property",
    icon: "/icons/motor.png",
    url: "/vakilsutra/ip"
  },
  {
    name: "Business Incorporation",
    icon: "/icons/motor.png",
    url: "/vakilsutra/corporate"
  },
  {
    name: "Labor & Compliance",
    icon: "/icons/motor.png",
    url: "/vakilsutra/labor"
  },
  {
    name: "Tax & Financial Compliance",
    icon: "/icons/motor.png",
    url: "/vakilsutra/tax"
  },
  {
    name: "Personal & Civil Services",
    icon: "/icons/motor.png",
    url: "/vakilsutra/property"
  },
  {
    name: "Property related Services",
    icon: "/icons/motor.png",
    url: "/vakilsutra/property"
  },
  {
    name: "Cyber Fraud",
    icon: "/icons/motor.png",
    url: "/vakilsutra/cyber"
  },
  {
    name: "Debt Relief",
    icon: "/icons/motor.png",
    url: "/vakilsutra/debt"
  }
];

export default function VakilsutraSelectCategory({ searchQuery = "" }: VakilsutraSelectCategoryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(legalCategories[0].name);

  useEffect(() => {
    if (!hasScrolled.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      if (scrollWidth > clientWidth) {
        container.scrollTo({
          left: scrollWidth - clientWidth,
          behavior: 'smooth'
        });
        
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
    setSelectedCategory(categoryName);
  };

  const filteredCategories = legalCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (filteredCategories.length > 0 && !filteredCategories.some(cat => cat.name === selectedCategory)) {
      setSelectedCategory(filteredCategories[0].name);
    }
  }, [searchQuery, filteredCategories]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-b from-white via-blue-50/30 to-white rounded-2xl p-6 shadow-sm border border-blue-100">
        <h2 className="text-2xl font-semibold text-blue-950 mb-6">Select Your Category</h2>
        <div 
          ref={scrollContainerRef}
          className="flex items-start gap-6 overflow-x-auto pb-4 hide-scrollbar"
        >
          {filteredCategories.map((category, index) => (
            <div 
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className={`flex flex-col items-center w-[140px] h-[180px] cursor-pointer group transition-all duration-200 ${
                selectedCategory === category.name 
                  ? 'bg-blue-600 rounded-xl p-4' 
                  : 'p-4'
              }`}
            >
              <div className="w-16 h-16 flex items-center justify-center mb-4">
                <img
                  src={category.icon}
                  alt={category.name}
                  className={`w-full h-full object-contain transition-all duration-200 ${
                    selectedCategory === category.name
                      ? 'brightness-0 invert'
                      : ''
                  }`}
                />
              </div>
              <div className="flex-1 flex items-center">
                <span className={`text-sm font-medium text-center transition-colors duration-200 w-full ${
                  selectedCategory === category.name
                    ? 'text-white'
                    : 'text-blue-950 group-hover:text-blue-800'
                }`}>
                  {category.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedCategory && <VakilsutraSelectServices category={selectedCategory} searchQuery={searchQuery} />}
      </div>
      <VakilsutraPopularServices />
      <VakilsutraAdCampaign />
    </div>
  );
}

const style = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = style;
  document.head.appendChild(styleElement);
} 