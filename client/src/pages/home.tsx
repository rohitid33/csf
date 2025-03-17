import React from "react";
import Hero from "@/components/home/hero";
import KnowYourPolicy from "@/components/home/know-your-policy";
import Process from "@/components/home/process";
import Testimonials from "@/components/home/testimonials";
import ClaimBanners from "@/components/home/claim-banners";
import PartnerCareers from "@/components/home/partner-careers";
import CTA from "@/components/home/cta";
import SelectCategory from "@/components/home/select-category";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ClaimBanners />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-blue-950 mb-6">Select your category</h2>
        <SelectCategory />
      </div>
      <div className="container mx-auto px-4 py-8">
        <KnowYourPolicy />
      </div>
      <Process />
      <Testimonials />
      <PartnerCareers />
      <div className="-mt-8">
        <CTA />
      </div>
    </div>
  );
}