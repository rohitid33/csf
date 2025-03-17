import React, { useState } from "react";

interface SelectServicesProps {
  category: string;
}

const motorInsuranceServices = [
  {
    name: "Motor Theft Claim",
    icon: "/icons/car_ins.png",
    url: "/service/67d7d0b9ba8af0c60c60b79e"
  },
  {
    name: "Motor Accident Insurance Claim",
    icon: "/icons/car_ins.png",
    url: "/service/67d7f548aee5a4ad962514e0"
  },
  {
    name: "Third Party Accident Claims",
    icon: "/icons/car_ins.png",
    url: "/service/67d7d0b9ba8af0c60c60b7a0"
  },
  {
    name: "Motor Test",
    icon: "/icons/car_ins.png",
    url: "/service/67d7d0b9ba8af0c60c60b7a1"
  }
];

export default function SelectServices({ category }: SelectServicesProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const getServices = () => {
    switch (category) {
      case "Motor Insurance":
        return motorInsuranceServices;
      default:
        return [];
    }
  };

  const services = getServices();

  const handleServiceClick = (serviceName: string, url: string) => {
    setSelectedService(serviceName);
    window.location.href = url;
  };

  return (
    <div className="mt-6 pt-4 border-t border-blue-100">
      <h3 className="text-lg font-semibold text-blue-950 mb-4">{category} Services</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {services.map((service, index) => (
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