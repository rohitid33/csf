import { Link } from "wouter";
import { useEffect, useState } from "react";
import { getAllServices, subscribeToServices } from "@/data/services-data";
import { ServiceData } from "@/components/services/service-template";

interface ServicesProps {
  category: string;
}

export default function Services({ category }: ServicesProps) {
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, any>>({});
  
  useEffect(() => {
    // Function to update services
    const updateServices = async () => {
      try {
        // Get all services from the data source (now async)
        const allServices = await getAllServices();
        
        // Group services by category
        const groupedServices: Record<string, any[]> = {};
        
        // Initialize with empty arrays for each category
        const categories = ["insurance", "loan", "consumer", "trademark", "business", "property"];
        categories.forEach(cat => {
          groupedServices[cat] = [];
        });
        
        // Add services to their respective categories
        allServices.forEach(service => {
          const serviceCategory = service.category || "insurance";
          if (!groupedServices[serviceCategory]) {
            groupedServices[serviceCategory] = [];
          }
          
          groupedServices[serviceCategory].push({
            title: service.title.split(" ").slice(0, 2).join(" "), // Shorten title for display
            icon: service.icon,
            link: `/service/${service.id}`
          });
        });
        
        // Add default services for categories that don't have any
        categories.forEach(cat => {
          if (groupedServices[cat].length === 0) {
            // Use the default services from the original implementation
            groupedServices[cat] = defaultServicesByCategory[cat] || [];
          }
        });
        
        setServicesByCategory(groupedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        // Use default services as fallback
        setServicesByCategory(defaultServicesByCategory);
      }
    };
    
    // Initial load
    updateServices();
    
    // Subscribe to service changes
    const unsubscribe = subscribeToServices(() => {
      updateServices();
    });
    
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);
  
  const services = servicesByCategory[category] || servicesByCategory.insurance || [];

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6 text-center">Services</h2>
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex flex-col gap-4">
            {/* First row of services */}
            <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide min-w-max">
              {services.slice(0, 6).map((service, index) => (
                <Link key={index} href={service.link}>
                  <a className="flex flex-col items-center min-w-[60px] flex-shrink-0">
                    <div className="w-6 h-6 md:w-16 md:h-16 rounded-full bg-white border shadow-sm flex items-center justify-center text-xs md:text-2xl mb-1 hover:shadow-md transition-shadow">
                      {service.icon}
                    </div>
                    <span className="text-[9px] md:text-sm text-center whitespace-nowrap">{service.title}</span>
                  </a>
                </Link>
              ))}
            </div>
            {/* Second row of services (if more than 6) */}
            {services.length > 6 && (
              <div className="flex justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide min-w-max">
                {services.slice(6).map((service, index) => (
                  <Link key={index} href={service.link}>
                    <a className="flex flex-col items-center min-w-[60px] flex-shrink-0">
                      <div className="w-6 h-6 md:w-16 md:h-16 rounded-full bg-white border shadow-sm flex items-center justify-center text-xs md:text-2xl mb-1 hover:shadow-md transition-shadow">
                        {service.icon}
                      </div>
                      <span className="text-[9px] md:text-sm text-center whitespace-nowrap">{service.title}</span>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Default services to use as fallback
const defaultServicesByCategory = {
  insurance: [
    {
      title: "Health Claim",
      icon: "🏥",
      link: "/service/health-claim"
    },
    {
      title: "Motor Accident",
      icon: "🚗",
      link: "/service/motor-claim"
    },
    {
      title: "Fire Claim",
      icon: "🔥",
      link: "/service/fire-claim"
    },
    {
      title: "Life Insurance",
      icon: "👥",
      link: "/service/life-claim"
    },
    {
      title: "Travel Claim",
      icon: "✈️",
      link: "/service/travel-claim"
    },
    {
      title: "Property Claim",
      icon: "🏠",
      link: "/service/property-claim"
    },
    {
      title: "Marine Claim",
      icon: "🚢",
      link: "/service/marine-claim"
    },
    {
      title: "Liability Claim",
      icon: "⚖️",
      link: "/service/liability-claim"
    }
  ],
  loan: [
    {
      title: "Debt Consolidation",
      icon: "💰",
      link: "/service/debt-consolidation"
    },
    {
      title: "Credit Repair",
      icon: "📈",
      link: "/service/credit-repair"
    },
    {
      title: "Debt Settlement",
      icon: "📝",
      link: "/service/debt-settlement"
    },
  ],
  consumer: [
    {
      title: "Product Issues",
      icon: "📦",
      link: "/service/product-issues"
    },
    {
      title: "Service Quality",
      icon: "⭐",
      link: "/service/service-quality"
    },
    {
      title: "Billing Disputes",
      icon: "💳",
      link: "/service/billing-disputes"
    },
  ],
  trademark: [
    {
      title: "Trademark Registration",
      icon: "™️",
      link: "/service/trademark-registration"
    },
    {
      title: "Patent Filing",
      icon: "📜",
      link: "/service/patent-filing"
    },
    {
      title: "Copyright Protection",
      icon: "©️",
      link: "/service/copyright-protection"
    },
    {
      title: "IP Infringement",
      icon: "🛡️",
      link: "/service/ip-infringement"
    },
    {
      title: "Brand Protection",
      icon: "🔒",
      link: "/service/brand-protection"
    },
    {
      title: "IP Licensing",
      icon: "📋",
      link: "/service/ip-licensing"
    }
  ],
  business: [
    {
      title: "Company Formation",
      icon: "🏢",
      link: "/service/company-formation"
    },
    {
      title: "NGO Registration",
      icon: "🤝",
      link: "/service/ngo-registration"
    },
    {
      title: "Legal Compliance",
      icon: "📊",
      link: "/service/legal-compliance"
    },
    {
      title: "Contract Review",
      icon: "📝",
      link: "/service/contract-review"
    },
    {
      title: "Business Disputes",
      icon: "⚖️",
      link: "/service/business-disputes"
    },
    {
      title: "Tax Advisory",
      icon: "💼",
      link: "/service/tax-advisory"
    }
  ],
  property: [
    {
      title: "Property Disputes",
      icon: "🏘️",
      link: "/service/property-disputes"
    },
    {
      title: "Title Verification",
      icon: "📄",
      link: "/service/title-verification"
    },
    {
      title: "Tenant Issues",
      icon: "🔑",
      link: "/service/tenant-issues"
    },
    {
      title: "Property Transfer",
      icon: "🤝",
      link: "/service/property-transfer"
    },
    {
      title: "Will & Succession",
      icon: "📜",
      link: "/service/will-succession"
    },
    {
      title: "Personal Injury",
      icon: "🩹",
      link: "/service/personal-injury"
    }
  ]
};