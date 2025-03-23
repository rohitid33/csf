import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Service {
  name: string;
  icon: string;
  url: string;
  description: string;
}

interface IPServices {
  [key: string]: Service[];
}

const ipServices: IPServices = {
  "Trademark Services": [
    {
      name: "Trademark Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-registration",
      description: "Register your brand identity with expert trademark registration services"
    },
    {
      name: "Search for Trademark",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-search",
      description: "Comprehensive trademark search to ensure your brand is unique"
    },
    {
      name: "Respond to TM Objection",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-objection",
      description: "Professional assistance in responding to trademark objections"
    },
    {
      name: "Well-Known Trademark",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/well-known-trademark",
      description: "Apply for well-known trademark status to strengthen your brand protection"
    },
    {
      name: "Trademark Watch",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-watch",
      description: "Monitor and protect your trademark from potential infringements"
    },
    {
      name: "Trademark Renewal",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-renewal",
      description: "Timely renewal of your trademark registration to maintain protection"
    },
    {
      name: "Trademark Assignment",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-assignment",
      description: "Legal transfer of trademark ownership with proper documentation"
    },
    {
      name: "USA Trademark",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/usa-trademark",
      description: "Register your trademark in the United States market"
    },
    {
      name: "International Trademark",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/international-trademark",
      description: "Global trademark registration through international treaties"
    },
    {
      name: "Trademark Infringement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/trademark-infringement",
      description: "Protect your trademark rights against unauthorized use"
    }
  ],
  "Copyright Services": [
    {
      name: "Copyright Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/copyright-registration",
      description: "Register your creative works for copyright protection"
    },
    {
      name: "Copyright Infringement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/copyright-infringement",
      description: "Take action against unauthorized use of your copyrighted works"
    }
  ],
  "Patent Services": [
    {
      name: "Indian Patent Search",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/patent-search",
      description: "Comprehensive patent search in Indian patent database"
    },
    {
      name: "Provisional Application",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/provisional-patent",
      description: "File a provisional patent application to secure priority date"
    },
    {
      name: "Permanent Patent",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/permanent-patent",
      description: "Complete patent application and registration process"
    },
    {
      name: "Patent Infringement",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/patent-infringement",
      description: "Protect your patent rights against unauthorized use"
    }
  ],
  "Design & Branding Services": [
    {
      name: "Logo Design",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/logo-design",
      description: "Professional logo design services for your brand"
    },
    {
      name: "Design Registration",
      icon: "/icons/motor.png",
      url: "/vakilsutra/ip/design-registration",
      description: "Register your industrial designs for legal protection"
    }
  ]
};

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
                    <div className={`w-16 h-16 flex items-center justify-center transition-all duration-200 group-hover:shadow-xl rounded-xl ${
                      selectedService === service.name ? 'bg-white' : 'bg-blue-50'
                    }`}>
                      <img
                        src={service.icon}
                        alt={service.name}
                        className="w-full h-full object-contain rounded-xl transition-all duration-200"
                      />
                    </div>
                    <div className="text-center">
                      <span className={`text-base font-medium block transition-colors duration-200 mb-1 ${
                        selectedService === service.name 
                          ? 'text-blue-950' 
                          : 'text-blue-800 group-hover:text-blue-600'
                      }`}>
                        {service.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {service.description}
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