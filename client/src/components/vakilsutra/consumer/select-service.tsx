import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Service {
  name: string;
  icon: string;
  url: string;
  description: string;
}

interface ConsumerServices {
  [key: string]: Service[];
}

const consumerServices: ConsumerServices = {
  "Consumer Complaint": [
    {
      name: "Product Quality Issues",
      icon: "/icons/motor.png",
      url: "/vakilsutra/consumer/product-quality",
      description: "File complaints against defective products and poor quality services"
    },
    {
      name: "Service Deficiency",
      icon: "/icons/motor.png",
      url: "/vakilsutra/consumer/service-deficiency",
      description: "Complain about inadequate or unsatisfactory services"
    },
    {
      name: "Price Disputes",
      icon: "/icons/motor.png",
      url: "/vakilsutra/consumer/price-disputes",
      description: "Resolve issues related to overcharging and unfair pricing"
    },
    {
      name: "Warranty Claims",
      icon: "/icons/motor.png",
      url: "/vakilsutra/consumer/warranty-claims",
      description: "Handle warranty and guarantee related complaints"
    }
  ],
  "E-Commerce Consumer Complaint": [
    {
      name: "Online Shopping Issues",
      icon: "/icons/motor.png",
      url: "/vakilsutra/consumer/online-shopping",
      description: "Complain about issues with online purchases and deliveries"
    },
    {
      name: "Payment Problems",
      icon: "/icons/motor.png",
      url: "/vakilsutra/consumer/payment-problems",
      description: "Resolve payment and refund related issues"
    },
    {
      name: "Delivery Delays",
      icon: "/icons/motor.png",
      url: "/vakilsutra/consumer/delivery-delays",
      description: "File complaints about delayed or failed deliveries"
    },
    {
      name: "Return & Refund",
      icon: "/icons/motor.png",
      url: "/vakilsutra/consumer/return-refund",
      description: "Handle return and refund related disputes"
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
      <h3 className="text-lg font-semibold text-blue-950 mb-4">Consumer Services</h3>
      <div className="space-y-8">
        {Object.entries(consumerServices).map(([subcategory, services]) => (
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