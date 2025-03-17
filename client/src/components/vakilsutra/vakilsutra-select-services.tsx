import React, { useState } from "react";

interface VakilsutraSelectServicesProps {
  category: string;
  searchQuery?: string;
}

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

  const getServices = () => {
    switch (category) {
      case "Criminal Law":
        return criminalLawServices;
      case "Civil Law":
        return civilLawServices;
      default:
        return [];
    }
  };

  const services = getServices();
  
  // Filter services based on search query
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceClick = (serviceName: string, url: string) => {
    setSelectedService(serviceName);
    window.location.href = url;
  };

  return (
    <div className="mt-6 pt-4 border-t border-blue-100">
      <h3 className="text-lg font-semibold text-blue-950 mb-4">{category} Services</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredServices.map((service, index) => (
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
    </div>
  );
} 