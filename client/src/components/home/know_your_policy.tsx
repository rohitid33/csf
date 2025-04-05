import { useLocation } from "wouter";
import { useRef, useEffect } from "react";

interface Banner {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
}

const banners: Banner[] = [
  {
    id: "1",
    title: "Insurance Claims",
    description: "Get expert help with your insurance claims",
    buttonText: "File a Claim",
    redirectUrl: "/service/file-claim"
  },
  {
    id: "2",
    title: "Policy Analysis",
    description: "Understand your policy better",
    buttonText: "Analyze Policy",
    redirectUrl: "/service/policy-analysis"
  },
  {
    id: "3",
    title: "Expert Consultation",
    description: "Talk to our insurance experts",
    buttonText: "Consult Now",
    redirectUrl: "/service/consult"
  }
];

export default function KnowYourPolicy() {
  const [_, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || hasScrolledRef.current) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    // Only scroll if content is wider than container
    if (scrollWidth > clientWidth) {
      // Scroll to the end
      container.scrollTo({
        left: scrollWidth - clientWidth,
        behavior: 'smooth'
      });
      
      // After scrolling back to start
      setTimeout(() => {
        container.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }, 1000);
    }
    
    hasScrolledRef.current = true;
  }, []);

  const handleClick = (url: string) => {
    setLocation(url);
  };

  return (
    <section className="py-4 md:py-6 bg-white">
      <div className="container mx-auto px-4">
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {banners.map((banner) => (
            <div 
              key={banner.id}
              className="relative w-[calc(100vw-2rem)] md:w-[calc(33.333%-1rem)] flex-shrink-0 h-[150px] md:h-[180px] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
              onClick={() => handleClick(banner.redirectUrl)}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(/consumer.jpg)` }}
              >
                {/* Gradient Overlay - Reduced opacity */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/10" />
              </div>

              {/* Claimsutra Logo in top right */}
              <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center z-10">
                <div className="flex items-center bg-white rounded-full px-2.5 py-0.5 md:px-3 md:py-1">
                  <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary flex items-center justify-center mr-1.5">
                    <span className="text-white text-xs md:text-sm">✓</span>
                  </div>
                  <div className="relative">
                    <span className="font-bold text-xs md:text-sm text-primary">Claimsutra</span>
                    <span className="absolute -top-1 -right-1.5 text-[6px] md:text-[8px] text-primary font-medium">TM</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 text-white">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1 drop-shadow-sm">{banner.title}</h3>
                  <p className="text-xs opacity-90 mb-2 md:mb-3 line-clamp-2 drop-shadow-sm">{banner.description}</p>
                  <button 
                    className="w-fit px-3 md:px-4 py-1 md:py-1.5 bg-white/90 text-blue-950 rounded-full font-medium hover:bg-white transition-all duration-200 text-xs md:text-sm shadow-sm hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(banner.redirectUrl);
                    }}
                  >
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
