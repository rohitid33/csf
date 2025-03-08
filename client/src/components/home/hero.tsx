import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Banner content for different categories
const categoryBanners = {
  insurance: [
    {
      title: "Expert Insurance Support",
      subtitle: "We help you navigate through complex insurance claims",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Fast Claim Resolution",
      subtitle: "Quick and efficient resolution for your insurance disputes",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Professional Assistance",
      subtitle: "Expert team ready to support your insurance needs",
      image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1920&q=80"
    }
  ],
  loan: [
    {
      title: "Debt Relief Solutions",
      subtitle: "Expert assistance to help you manage and reduce your debt",
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Financial Recovery",
      subtitle: "Strategies to overcome debt and rebuild your financial health",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Debt Consolidation",
      subtitle: "Simplify your finances with our debt consolidation solutions",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80"
    }
  ],
  consumer: [
    {
      title: "Strategic Consumer Protection",
      subtitle: "Expert guidance for resolving consumer disputes",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Consumer Rights Advocacy",
      subtitle: "Protecting your rights with our professional advisors",
      image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Dispute Resolution",
      subtitle: "Effective solutions for consumer complaint resolution",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1920&q=80"
    }
  ],
  trademark: [
    {
      title: "Intellectual Property Protection",
      subtitle: "Safeguard your innovations and creative works",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Trademark Registration",
      subtitle: "Secure your brand identity with expert legal assistance",
      image: "https://images.unsplash.com/photo-1607703703520-bb638e84caf2?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Copyright & Patent Services",
      subtitle: "Comprehensive legal protection for your intellectual assets",
      image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=1920&q=80"
    }
  ],
  business: [
    {
      title: "Business Legal Solutions",
      subtitle: "Expert legal guidance for businesses and NGOs",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Corporate Compliance",
      subtitle: "Navigate regulatory requirements with our specialized support",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "NGO Registration & Support",
      subtitle: "Comprehensive legal assistance for non-profit organizations",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1920&q=80"
    }
  ],
  property: [
    {
      title: "Property Dispute Resolution",
      subtitle: "Expert legal assistance for property-related conflicts",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Personal Legal Protection",
      subtitle: "Safeguarding your personal rights and interests",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1920&q=80"
    },
    {
      title: "Real Estate Legal Services",
      subtitle: "Comprehensive legal support for all property matters",
      image: "https://images.unsplash.com/photo-1560518883-3d5aa21917c1?auto=format&fit=crop&w=1920&q=80"
    }
  ]
};

interface HeroBannerProps {
  category: string;
}

export default function HeroBanner({ category }: HeroBannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Get the banners for the current category, default to insurance if not found
  const activeBanners = categoryBanners[category as keyof typeof categoryBanners] || categoryBanners.insurance;
  const currentBannerContent = activeBanners[currentBanner];
  
  // Select a fixed background image for each category
  const categoryBackgroundImage = useMemo(() => {
    // Use the first image of each category as the fixed background
    const categoryImages = {
      insurance: categoryBanners.insurance[0].image,
      loan: categoryBanners.loan[0].image,
      consumer: categoryBanners.consumer[0].image,
      trademark: categoryBanners.trademark[0].image,
      business: categoryBanners.business[0].image,
      property: categoryBanners.property[0].image
    };
    return categoryImages[category as keyof typeof categoryImages] || categoryBanners.insurance[0].image;
  }, [category]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [category, activeBanners.length]);

  // Reset banner index when category changes
  useEffect(() => {
    setCurrentBanner(0);
  }, [category]);

  return (
    <div className="px-6 py-2 md:px-6 md:py-6">
      <div className="
        relative h-[20vh] md:h-[45vh] rounded-2xl overflow-hidden max-w-5xl mx-auto
        shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        border border-white/10
        bg-gradient-to-r from-primary/5 via-background to-primary/5
      ">
        {/* Background image with overlay - only changes with category */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${category}-background`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url("${categoryBackgroundImage}")`,
              filter: 'brightness(0.4)'
            }}
          />
        </AnimatePresence>
        
        {/* Stylish overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 mix-blend-overlay" />
        
        {/* Content container */}
        <div className="relative h-full flex flex-col justify-center">
          {/* Text content - changes with timer */}
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl text-white"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${category}-${currentBanner}-text`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="backdrop-blur-sm bg-black/10 rounded-xl p-4 md:p-6 border border-white/10"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                      <h1 className="text-2xl md:text-4xl font-bold text-white/90">
                        {currentBannerContent.title}
                      </h1>
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg 
                          className="w-4 h-4 text-white" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2.5} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm md:text-lg text-white/75">
                      {currentBannerContent.subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </div>
  );
}