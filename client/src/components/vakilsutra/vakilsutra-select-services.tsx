import React, { useState } from "react";

interface VakilsutraSelectServicesProps {
  category: string;
  searchQuery?: string;
}

interface Service {
  name: string;
  icon: string;
  url: string;
}

interface TrademarkIPServices {
  [key: string]: Service[];
}

const trademarkIPServices: TrademarkIPServices = {
  "Trademark Services": [
    {
      name: "Trademark Registration",
      icon: "/icons/trademark-registration.png",
      url: "/vakilsutra/trademarkip/trademark-registration"
    },
    {
      name: "Search for Trademark",
      icon: "/icons/trademark-search.png",
      url: "/vakilsutra/trademarkip/trademark-search"
    },
    {
      name: "Respond to TM Objection",
      icon: "/icons/trademark-objection.png",
      url: "/vakilsutra/trademarkip/trademark-objection"
    },
    {
      name: "Trademark Renewal",
      icon: "/icons/trademark-renewal.png",
      url: "/vakilsutra/trademarkip/trademark-renewal"
    },
    {
      name: "Trademark Assignment",
      icon: "/icons/trademark-assignment.png",
      url: "/vakilsutra/trademarkip/trademark-assignment"
    },
    {
      name: "Trademark Infringement",
      icon: "/icons/trademark-infringement.png",
      url: "/vakilsutra/trademarkip/trademark-infringement"
    }
  ],
  "Copyright Services": [
    {
      name: "Copyright Registration",
      icon: "/icons/copyright-registration.png",
      url: "/vakilsutra/trademarkip/copyright-registration"
    },
    {
      name: "Copyright Infringement",
      icon: "/icons/copyright-infringement.png",
      url: "/vakilsutra/trademarkip/copyright-infringement"
    }
  ],
  "Patent Services": [
    {
      name: "Indian Patent Search",
      icon: "/icons/patent-search.png",
      url: "/vakilsutra/trademarkip/patent-search"
    },
    {
      name: "Provisional Application",
      icon: "/icons/provisional-patent.png",
      url: "/vakilsutra/trademarkip/provisional-patent"
    },
    {
      name: "Permanent Patent",
      icon: "/icons/permanent-patent.png",
      url: "/vakilsutra/trademarkip/permanent-patent"
    },
    {
      name: "Patent Infringement",
      icon: "/icons/patent-infringement.png",
      url: "/vakilsutra/trademarkip/patent-infringement"
    }
  ],
  "Design & Branding Services": [
    {
      name: "Logo Design",
      icon: "/icons/logo-design.png",
      url: "/vakilsutra/trademarkip/logo-design"
    },
    {
      name: "Design Registration",
      icon: "/icons/design-registration.png",
      url: "/vakilsutra/trademarkip/design-registration"
    }
  ]
};

const criminalLawServices = [
  {
    name: "Bail Application",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/criminal-law/bail-application"
  },
  {
    name: "Criminal Defense",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/criminal-law/criminal-defense"
  },
  {
    name: "Police Complaint",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/criminal-law/police-complaint"
  }
];

const civilLawServices = [
  {
    name: "Property Disputes",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/civil-law/property-disputes"
  },
  {
    name: "Contract Disputes",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/civil-law/contract-disputes"
  },
  {
    name: "Consumer Cases",
    icon: "/icons/car_ins.png",
    url: "/vakilsutra/civil-law/consumer-cases"
  }
];

export default function VakilsutraSelectServices({ category, searchQuery = "" }: VakilsutraSelectServicesProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState<{ [key: string]: boolean }>({
    "Trademark Services": true,
    "Copyright Services": true,
    "Patent Services": true,
    "Design & Branding Services": true
  });

  const getServices = () => {
    switch (category) {
      case "Criminal Law":
        return criminalLawServices;
      case "Civil Law":
        return civilLawServices;
      case "Trademark & IP":
        return trademarkIPServices;
      default:
        return [];
    }
  };

  const services = getServices();
  
  // Filter services based on search query
  const filteredServices = Array.isArray(services) 
    ? services.filter(service => service.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : services;

  const handleServiceClick = (serviceName: string, url: string) => {
    setSelectedService(serviceName);
    window.location.href = url;
  };

  const toggleSubcategory = (subcategory: string) => {
    setExpandedSubcategories(prev => ({
      ...prev,
      [subcategory]: !prev[subcategory]
    }));
  };

  return (
    <div className="mt-6 pt-4 border-t border-blue-100">
      <h3 className="text-lg font-semibold text-blue-950 mb-4">{category} Services</h3>
      {category === "Trademark & IP" ? (
        <div className="space-y-8">
          {Object.entries(trademarkIPServices).map(([subcategory, subServices]) => (
            <div key={subcategory}>
              <div 
                onClick={() => toggleSubcategory(subcategory)}
                className="flex items-center justify-between cursor-pointer mb-4 group"
              >
                <h4 className="text-md font-medium text-blue-800 group-hover:text-blue-600 transition-colors duration-200">
                  {subcategory}
                </h4>
                <svg
                  className={`w-5 h-5 text-blue-800 transform transition-transform duration-200 ${
                    expandedSubcategories[subcategory] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {expandedSubcategories[subcategory] && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {subServices.map((service: Service, index: number) => (
                    <div 
                      key={index}
                      onClick={() => handleServiceClick(service.name, service.url)}
                      className={`flex flex-col items-center gap-3 p-4 bg-white rounded-xl border transition-all duration-200 cursor-pointer group ${
                        selectedService === service.name 
                          ? 'border-blue-500 shadow-lg bg-blue-50' 
                          : 'border-blue-100 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                        selectedService === service.name 
                          ? 'bg-blue-100 shadow-inner' 
                          : 'bg-blue-50 group-hover:bg-blue-100'
                      }`}>
                        <img
                          src={service.icon}
                          alt={service.name}
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className={`text-sm font-medium text-center transition-colors duration-200 ${
                        selectedService === service.name 
                          ? 'text-blue-800' 
                          : 'text-blue-950 group-hover:text-blue-800'
                      }`}>
                        {service.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(services as Service[]).map((service: Service, index: number) => (
            <div 
              key={index}
              onClick={() => handleServiceClick(service.name, service.url)}
              className={`flex flex-col items-center gap-3 p-4 bg-white rounded-xl border transition-all duration-200 cursor-pointer group ${
                selectedService === service.name 
                  ? 'border-blue-500 shadow-lg bg-blue-50' 
                  : 'border-blue-100 hover:shadow-md'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                selectedService === service.name 
                  ? 'bg-blue-100 shadow-inner' 
                  : 'bg-blue-50 group-hover:bg-blue-100'
              }`}>
                <img
                  src={service.icon}
                  alt={service.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className={`text-sm font-medium text-center transition-colors duration-200 ${
                selectedService === service.name 
                  ? 'text-blue-800' 
                  : 'text-blue-950 group-hover:text-blue-800'
              }`}>
                {service.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 