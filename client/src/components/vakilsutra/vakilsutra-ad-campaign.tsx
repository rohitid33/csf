import React, { useEffect, useRef } from 'react';

interface Banner {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  redirectUrl: string;
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Start Your Business Journey",
    description: "Register your company with expert guidance and legal compliance",
    imageUrl: "/images/banners/business-registration.jpg",
    buttonText: "Get Started",
    redirectUrl: "/vakilsutra/corporate"
  },
  {
    id: 2,
    title: "Protect Your Brand",
    description: "Secure your intellectual property with trademark registration",
    imageUrl: "/images/banners/trademark-registration.jpg",
    buttonText: "Register Now",
    redirectUrl: "/vakilsutra/ip"
  },
  {
    id: 3,
    title: "Tax Compliance Made Easy",
    description: "Streamline your tax registration and compliance process",
    imageUrl: "/images/banners/tax-compliance.jpg",
    buttonText: "Learn More",
    redirectUrl: "/vakilsutra/tax"
  }
];

export default function VakilsutraAdCampaign() {
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
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 hide-scrollbar"
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative h-[200px] md:h-[250px] rounded-xl overflow-hidden cursor-pointer group min-w-[calc(100vw-2rem)] md:min-w-0 md:w-1/3"
              onClick={() => window.location.href = banner.redirectUrl}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/20" />
              </div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 drop-shadow-sm">
                    {banner.title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base mb-4 line-clamp-2 drop-shadow-sm">
                    {banner.description}
                  </p>
                  <button className="bg-white/90 hover:bg-white text-blue-950 font-medium px-4 py-2 rounded-lg transition-colors duration-200">
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 