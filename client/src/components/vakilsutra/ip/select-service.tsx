import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Service {
  name: string;
  icon: string;
  url: string;
}

interface IPServices {
  [key: string]: Service[];
}

const ipServices: IPServices = {
  "Trademark Services": [
    {
      name: "Trademark Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-registration"
    },
    {
      name: "Search for Trademark",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-search"
    },
    {
      name: "Respond to TM Objection",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-objection"
    },
    {
      name: "Well-Known Trademark",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/well-known-trademark"
    },
    {
      name: "Trademark Watch",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-watch"
    },
    {
      name: "Trademark Renewal",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-renewal"
    },
    {
      name: "Trademark Assignment",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-assignment"
    },
    {
      name: "USA Trademark",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/usa-trademark"
    },
    {
      name: "International Trademark",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/international-trademark"
    },
    {
      name: "Trademark Infringement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-infringement"
    }
  ],
  "Copyright Services": [
    {
      name: "Copyright Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/copyright-registration"
    },
    {
      name: "Copyright Infringement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/copyright-infringement"
    }
  ],
  "Patent Services": [
    {
      name: "Indian Patent Search",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/patent-search"
    },
    {
      name: "Provisional Application",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/provisional-patent"
    },
    {
      name: "Permanent Patent",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/permanent-patent"
    },
    {
      name: "Patent Infringement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/patent-infringement"
    }
  ],
  "Design & Branding Services": [
    {
      name: "Logo Design",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/logo-design"
    },
    {
      name: "Design Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/design-registration"
    }
  ]
};

const JWT_EXPIRES_IN: number = 24 * 60 * 60; // 24 hours in seconds

export default function SelectService() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceClick = (serviceName: string, url: string) => {
    setSelectedService(serviceName);
    window.location.href = url;
  };

  return (
    <div className="mt-6 pt-4 border-t border-blue-100">
      <h3 className="text-lg font-semibold text-blue-950 mb-4">IP Services</h3>
      <div className="space-y-8">
        {Object.entries(ipServices).map(([subcategory, services]) => (
          <div key={subcategory}>
            <h4 className="text-md font-medium text-blue-800 mb-4">{subcategory}</h4>
            <ScrollArea className="w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="flex gap-4 pb-4 overflow-y-visible" style={{ scrollBehavior: 'smooth', willChange: 'transform' }}>
                {services.map((service: Service, index: number) => (
                  <div 
                    key={index}
                    onClick={() => handleServiceClick(service.name, service.url)}
                    className={`flex flex-col items-center gap-3 p-4 cursor-pointer group rounded-xl transition-all duration-200 min-w-[200px] sm:min-w-[250px] ${
                      selectedService === service.name 
                        ? 'bg-blue-50 shadow-md' 
                        : 'hover:bg-blue-50/50'
                    }`}
                  >
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-200 group-hover:shadow-xl rounded-xl ${
                      selectedService === service.name ? 'bg-white' : 'bg-blue-50'
                    }`}>
                      <img
                        src={service.icon}
                        alt={service.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl transition-all duration-200"
                      />
                    </div>
                    <div className="text-center">
                      <span className={`text-base font-medium block transition-colors duration-200 ${
                        selectedService === service.name 
                          ? 'text-blue-950' 
                          : 'text-blue-800 group-hover:text-blue-600'
                      }`}>
                        {service.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
} 