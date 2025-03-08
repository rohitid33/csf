import { useState, useEffect } from "react";
import HeroBanner from "@/components/home/hero";
import Categories from "@/components/home/categories";
import ServicesSection from "@/components/home/services-section";
import PopularServices from "@/components/home/popular-services";
import Testimonials from "@/components/home/testimonials";
import CTA from "@/components/home/cta";
import PartnerAndCareers from "@/components/home/partner-careers";
import Process from "@/components/home/process";
import ClaimBanners from "@/components/home/claim-banners";
import { getAllCategories } from "@/data/categories-data";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Set default category when component mounts
  useEffect(() => {
    const setInitialCategory = async () => {
      try {
        // Get all categories
        const categories = await getAllCategories();
        // Set the first category as default if categories exist
        if (categories && categories.length > 0) {
          setSelectedCategory(categories[0].id);
        }
      } catch (error) {
        console.error("Error setting initial category:", error);
      }
    };
    
    if (!selectedCategory) {
      setInitialCategory();
    }
  }, []);
  
  return (
    <>
      <HeroBanner category={selectedCategory} />
      <ClaimBanners />
      <Categories 
        selected={selectedCategory} 
        onSelect={setSelectedCategory} 
      />
      <ServicesSection selectedCategory={selectedCategory} />
      <Process />
      <PopularServices />
      <Testimonials />
      <CTA />
      <PartnerAndCareers />
    </>
  );
}