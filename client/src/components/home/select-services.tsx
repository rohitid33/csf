import React, { useState } from "react";

interface SelectServicesProps {
  category: string;
}

const motorInsuranceServices = [
  {
    name: "Motor Theft Claim",
    icon: "/icons/cartheft.png",
    url: "/service/67d87dd8586ae9b3babb7d63"
  },
  {
    name: "Motor Accident Insurance Claim",
    icon: "/icons/accident.png",
    url: "/service/67d7f548aee5a4ad962514e0"
  },
  {
    name: "Third Party Accident Claims",
    icon: "/icons/thirdparty.png",
    url: "/service/67d7d0b9ba8af0c60c60b7a0"
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
            className={`flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-4 cursor-pointer group ${
              selectedService === service.name ? 'bg-blue-50 rounded-xl' : ''
            }`}
          >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-200 group-hover:shadow-xl rounded-xl sm:rounded-2xl ${
              selectedService === service.name ? 'bg-white' : 'bg-blue-50'
            }`}>
              <img
                src={service.icon}
                alt={service.name}
                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-xl sm:rounded-2xl transition-all duration-200 group-hover:shadow-lg"
              />
            </div>
            <span className={`text-sm sm:text-base font-medium text-center transition-colors duration-200 ${
              selectedService === service.name 
                ? 'text-blue-950' 
                : 'text-blue-800 group-hover:text-blue-600'
            }`}>
              {service.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}