import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Protect Your Intellectual Property",
    subtitle: "Expert legal assistance for patents, trademarks, and copyrights",
    image: "/consumer.jpg"
  },
  {
    title: "Safeguard Your Innovations",
    subtitle: "Comprehensive IP protection for your creative works",
    image: "/consumer.jpg"
  },
  {
    title: "Professional IP Support",
    subtitle: "Dedicated team of intellectual property experts",
    image: "/consumer.jpg"
  }
];

export default function IPHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const scrollToComplaintSection = () => {
    const complaintSection = document.getElementById("complaint-section");
    if (complaintSection) {
      complaintSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative h-[200px] md:h-[300px] overflow-hidden rounded-2xl mx-4 md:mx-8">
      {/* Fixed Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl"
        style={{ backgroundImage: `url(${slides[0].image})` }}
      >
        <div className="absolute inset-0 bg-black/50 rounded-2xl" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-white"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">
                {slides[currentSlide].title}
              </h1>
              <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-6">
                {slides[currentSlide].subtitle}
              </p>
              <Button
                onClick={scrollToComplaintSection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm md:text-base"
              >
                File Your IP Complaint
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 