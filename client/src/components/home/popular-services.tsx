import { Link } from "wouter";
import { useEffect, useState } from "react";
import { getAllServices, subscribeToServices } from "@/data/services-data";
import { ServiceData } from "@/components/services/service-template";

export default function PopularServices() {
  const [popularServices, setPopularServices] = useState<{ title: string; icon: string; link: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Function to update popular services
    const updatePopularServices = async () => {
      try {
        setLoading(true);
        // Get all services from the data source (now async)
        const allServices = await getAllServices();
        
        // Filter for popular services
        const popular = allServices
          .filter(service => service.popular)
          .map(service => ({
            title: service.title.split(" ").slice(0, 2).join(" "), // Shorten title for display
            icon: service.icon,
            link: `/service/${service.id}`
          }));
        
        // If no popular services are found, use some default ones
        if (popular.length === 0) {
          setPopularServices(defaultPopularServices);
        } else {
          setPopularServices(popular);
        }
      } catch (error) {
        console.error("Error fetching popular services:", error);
        setPopularServices(defaultPopularServices);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial load
    updatePopularServices();
    
    // Subscribe to service changes
    const unsubscribe = subscribeToServices(() => {
      updatePopularServices();
    });
    
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // If loading or no services are loaded yet, show loading state or fallback
  if (loading) {
    return <div className="py-6 bg-gray-50"><div className="container mx-auto px-4">Loading popular services...</div></div>;
  }
  
  if (popularServices.length === 0) {
    return null;
  }

  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-semibold mb-6">Popular Services</h2>
        <div className="overflow-x-auto scrolling-touch">
          <div className="flex gap-4 pb-4 min-w-max animate-scroll md:animate-none">
            {popularServices.map((service, index) => (
              <Link key={index} href={service.link}>
                <a className="flex flex-col items-center min-w-[100px]">
                  <div className="w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center text-2xl mb-2 hover:shadow-md transition-shadow">
                    {service.icon}
                  </div>
                  <span className="text-sm text-center whitespace-nowrap">{service.title}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Default popular services to use as fallback
const defaultPopularServices = [
  {
    title: "Health Insurance",
    icon: "🏥",
    link: "/service/health-claim"
  },
  {
    title: "Car Insurance",
    icon: "🚗",
    link: "/service/motor-claim"
  },
  {
    title: "Life Insurance",
    icon: "👥",
    link: "/service/life-claim"
  },
  {
    title: "Property Insurance",
    icon: "🏠",
    link: "/service/property-claim"
  },
  {
    title: "Travel Insurance",
    icon: "✈️",
    link: "/service/travel-claim"
  }
];