import React, { useEffect, useRef } from 'react';

interface PopularService {
  name: string;
  icon: string;
  url: string;
}

const popularServices: PopularService[] = [
  {
    name: "Private Limited Company",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/corporate/private-ltd"
  },
  {
    name: "Trademark Registration",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/ip/trademark"
  },
  {
    name: "GST Registration",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/tax/gst"
  },
  {
    name: "Property Registration",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/property/registration"
  },
  {
    name: "Consumer Complaint",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/consumer/complaint"
  },
  {
    name: "Digital Signature",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/corporate/dsc"
  }
];

export default function VakilsutraPopularServices() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
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
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 mb-6">
      <h2 className="text-2xl font-semibold text-blue-950 mb-6">Popular Services</h2>
      <div 
        ref={scrollContainerRef}
        className="flex md:grid md:grid-cols-6 gap-4 md:gap-6 overflow-x-auto pb-4 hide-scrollbar"
      >
        {popularServices.map((service, index) => (
          <a
            key={index}
            href={service.url}
            className="flex flex-col items-center gap-3 group cursor-pointer min-w-[140px] md:min-w-0"
          >
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center transition-all duration-200 group-hover:bg-blue-100 shadow-md group-hover:shadow-xl border border-blue-100">
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                  src={service.icon}
                  alt={service.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="h-[80px] flex items-center">
              <span className="text-base font-medium text-blue-950 text-center group-hover:text-blue-800 transition-colors duration-200 w-full px-2 break-words">
                {service.name}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
} 