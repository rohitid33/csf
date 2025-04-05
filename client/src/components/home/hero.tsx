import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Banner content
const banners = [
  {
    title: "Expert Insurance Support",
    subtitle: "We help you navigate through complex insurance claims",
    customerImage: "/glücklicher-junger-indischer-mann-und-frau-die-im-park-schläge-zeigen-modified.png"
  },
  {
    title: "Fast Claim Resolution",
    subtitle: "Quick and efficient resolution for your insurance disputes",
    customerImage: "/happyfarmer-modified.png"
  },
  {
    title: "Professional Assistance",
    subtitle: "Expert team ready to support your insurance needs",
    customerImage: "/happywoman_cir.png"
  }
];

// Customer testimonial images for the floating animation
const customerImages = [
  "/glücklicher-junger-indischer-mann-und-frau-die-im-park-schläge-zeigen-modified.png",
  "/happy_cust.jpeg",
  "/happyfarmer-modified.png",
  "/junger-indischer-bauer-mit-seinem-neuen-motorrad-modified.png"
];

export default function HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Go to next or previous banner
  const goToNextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };
  
  const goToPrevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Scroll to specific sections
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHowWeWork = () => {
    const howWeWorkSection = document.getElementById('how-we-work-section');
    if (howWeWorkSection) {
      howWeWorkSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goToNextBanner();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-4 md:py-8">
      <div className="container mx-auto px-3 md:px-6">
        {/* Narrower, taller hero banner with rounded edges */}
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-xl shadow-sm border border-primary bg-white md:bg-transparent">
            <div className="relative z-10 flex flex-row py-8 px-3 md:py-10 md:px-8">
              {/* Left section with text content */}
              <div className="w-3/5 md:w-1/2 pr-2 md:pr-4 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`banner-content-${currentBanner}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h1 className="text-base md:text-xl lg:text-2xl font-bold mb-1 md:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                      {banners[currentBanner].title}
                    </h1>
                    <p className="text-xs md:text-sm text-foreground/80 mb-2 md:mb-4 max-w-md line-clamp-3 md:line-clamp-none">
                      {banners[currentBanner].subtitle}
                    </p>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-white text-xs md:text-sm py-1 h-7 md:h-8"
                        onClick={scrollToCategories}
                      >
                        Get Started
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-primary text-primary hover:border-primary hover:bg-primary/5 text-xs md:text-sm py-1 h-7 md:h-8"
                        onClick={scrollToHowWeWork}
                      >
                        Learn More
                      </Button>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Indicators */}
                <div className="flex items-center gap-1 md:gap-1.5 mt-3 md:mt-6">
                  {banners.map((_, index) => (
                    <button
                      key={`indicator-${index}`}
                      onClick={() => setCurrentBanner(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-1 transition-all ${
                        currentBanner === index 
                          ? "bg-primary w-3 md:w-4" 
                          : "bg-primary/30 w-1 md:w-1.5 hover:bg-primary/50"
                      } rounded-full`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Right section with customer images */}
              <div className="w-2/5 md:w-1/2 flex justify-center items-center">
                <div className="relative h-[140px] md:h-[220px] w-[140px] md:w-[220px] border border-primary rounded-full p-2 md:p-3">
                  {/* Main featured customer image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`featured-customer-${currentBanner}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="h-full w-full rounded-full overflow-hidden border border-primary shadow-sm z-20 relative"
                    >
                      <img 
                        src={banners[currentBanner].customerImage} 
                        alt="Happy customer" 
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Floating small customer images - mobile and desktop optimized */}
                  <div className="absolute top-[-5%] right-[-5%] h-9 w-9 md:h-14 md:w-14 rounded-full overflow-hidden border border-primary shadow-sm z-10">
                    <img src={customerImages[0]} alt="Customer" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute bottom-[10%] right-[-8%] h-8 w-8 md:h-12 md:w-12 rounded-full overflow-hidden border border-primary shadow-sm z-10">
                    <img src={customerImages[1]} alt="Customer" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute bottom-[-5%] left-[25%] h-10 w-10 md:h-16 md:w-16 rounded-full overflow-hidden border border-primary shadow-sm z-10">
                    <img src={customerImages[2]} alt="Customer" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute top-[15%] left-[-10%] h-8 w-8 md:h-13 md:w-13 rounded-full overflow-hidden border border-primary shadow-sm z-10">
                    <img src={customerImages[3]} alt="Customer" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation arrows */}
            <div className="absolute top-1/2 left-1 z-10 transform -translate-y-1/2 md:left-2">
              <button 
                onClick={goToPrevBanner}
                className="bg-primary/10 hover:bg-primary/20 p-1 rounded-full text-primary"
                aria-label="Previous slide"
              >
                <ChevronLeft size={10} className="md:w-3 md:h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
            <div className="absolute top-1/2 right-1 z-10 transform -translate-y-1/2 md:right-2">
              <button 
                onClick={goToNextBanner}
                className="bg-primary/10 hover:bg-primary/20 p-1 rounded-full text-primary"
                aria-label="Next slide"
              >
                <ChevronRight size={10} className="md:w-3 md:h-3 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}