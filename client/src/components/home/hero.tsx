import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Banner content
const banners = [
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
];

export default function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const currentBannerContent = banners[currentBanner];
  
  // Use the banner image from public directory
  const bannerImage = "/banner.jpg";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-6 py-2 md:px-6 md:py-6">
      <div className="
        relative h-[25vh] md:h-[30vh] rounded-2xl overflow-hidden max-w-5xl mx-auto
        shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        border border-white/10
        bg-gradient-to-r from-primary/5 via-background to-primary/5
      ">
        {/* Fixed background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url("${bannerImage}")`,
            backgroundPosition: "center 40%", 
            filter: 'brightness(0.85)'
          }}
        />
        
        {/* Stylish overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 mix-blend-overlay" />
        
        {/* Content container */}
        <div className="relative h-full flex flex-col justify-center">
          {/* Text content - changes with timer */}
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`banner-${currentBanner}-text`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 md:p-6"
                >
                  <div>
                    <div className="mb-2 md:mb-3">
                      <h1 className="text-2xl md:text-4xl font-bold text-white/90">
                        {currentBannerContent.title}
                      </h1>
                    </div>
                    <p className="text-sm md:text-lg text-white/75">
                      {currentBannerContent.subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    </div>
  );
}