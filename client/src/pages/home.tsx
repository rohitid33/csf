import { useState, useEffect } from "react";
import HeroBanner from "@/components/home/hero";
import Categories from "@/components/home/categories";
import ServicesSection from "@/components/home/services-section";
import PopularServices from "@/components/home/popular-services";
import Testimonials from "@/components/home/testimonials";
import CTA from "@/components/home/cta";
import PartnerAndCareers from "@/components/home/partner-careers";
import Process from "@/components/home/process";
import { getAllCategories } from "@/data/categories-data";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  
  return (
    <>
      <HeroBanner category={selectedCategory} />
      <Categories 
        selected={selectedCategory} 
        onSelect={setSelectedCategory} 
      />
      {selectedCategory && (
        <ServicesSection selectedCategory={selectedCategory} />
      )}
      <Process />
      <PopularServices />
      <Testimonials />
      <CTA />
      <PartnerAndCareers />
    </>
  );
}