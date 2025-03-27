import React from "react";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const promotionalBanners = [
  {
    title: "Patent Protection Services",
    description: "Secure your inventions with expert patent filing and protection",
    image: "/consumer.jpg",
    url: "/vakilsutra/ip/patent-protection"
  },
  {
    title: "Copyright Registration",
    description: "Protect your creative works with copyright registration",
    image: "/consumer.jpg",
    url: "/vakilsutra/ip/copyright-registration"
  },
  {
    title: "Trademark Services",
    description: "Register and protect your brand identity",
    image: "/consumer.jpg",
    url: "/vakilsutra/ip/trademark-services"
  }
];

export default function PromotionalBanner() {
  const handleBannerClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 mt-8 md:mt-12">
      <ScrollArea className="w-full overflow-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-4 sm:gap-6 pb-4 overflow-x-auto overflow-y-hidden" style={{ scrollBehavior: 'smooth', willChange: 'transform' }}>
          {promotionalBanners.map((banner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              onClick={() => handleBannerClick(banner.url)}
              className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer w-[85vw] sm:w-[300px] md:w-[400px] lg:w-[500px] flex-shrink-0"
            >
              <div className="relative h-[200px] sm:h-[250px]">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">{banner.title}</h3>
                  <p className="text-sm sm:text-base md:text-lg opacity-90">{banner.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
} 