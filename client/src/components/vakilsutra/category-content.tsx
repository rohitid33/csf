import React from "react";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Clock, Shield, Users, FileText, Search, CheckCircle2, ArrowRightCircle, FileCheck, SearchCheck, ShieldCheck } from "lucide-react";

// Import Consumer components
import ConsumerHero from "./consumer/hero";
import ConsumerBanners from "./consumer/banners";
import ConsumerProcess from "./consumer/process";
import ConsumerTestimonials from "./consumer/testimonials";
import ConsumerAboutUs from "./consumer/about-us";
import ConsumerCTA from "./consumer/cta";
import ConsumerSelectService from "./consumer/select-service";
import ConsumerPromotionalBanner from "./consumer/promotional-banner";

// Import IP components
import IPHero from "./ip/hero";
import IPBanners from "./ip/banners";
import IPProcess from "./ip/process";
import IPTestimonials from "./ip/testimonials";
import IPAboutUs from "./ip/about-us";
import IPCTA from "./ip/cta";
import SelectService from "./ip/select-service";
import PromotionalBanner from "./ip/promotional-banner";

// Import Corporate components
import CorporateHero from "./corporate/hero";
import CorporateBanners from "./corporate/banners";
import CorporateSelectService from "./corporate/select-service";
import CorporatePromotionalBanner from "./corporate/promotional-banner";
import CorporateProcess from "./corporate/process";
import CorporateTestimonials from "./corporate/testimonials";
import CorporateAboutUs from "./corporate/about-us";
import CorporateCTA from "./corporate/cta";
import DebtHero from "./debt/hero";
import DebtBanners from "./debt/banners";
import DebtSelectService from "./debt/select-service";
import DebtPromotionalBanner from "./debt/promotional-banner";
import DebtProcess from "./debt/process";
import DebtTestimonials from "./debt/testimonials";
import DebtAboutUs from "./debt/about-us";
import DebtCTA from "./debt/cta";

interface CategoryContentProps {
  category: string;
}

export default function CategoryContent({ category }: CategoryContentProps) {
  const renderContent = () => {
    switch (category) {
      case "Consumer Complaint":
        return (
          <>
            <ConsumerHero />
            <ConsumerBanners />
            <ConsumerSelectService />
            <ConsumerPromotionalBanner />
            <ConsumerProcess />
            <ConsumerTestimonials />
            <ConsumerAboutUs />
            <ConsumerCTA />
          </>
        );
      case "Intellectual Property":
        return (
          <>
            <IPHero />
            <IPBanners />
            <SelectService />
            <PromotionalBanner />
            <IPProcess />
            <IPTestimonials />
            <IPAboutUs />
            <IPCTA />
          </>
        );
      case "Business Incorporation":
        return (
          <>
            <CorporateHero />
            <CorporateBanners />
            <CorporateSelectService />
            <CorporatePromotionalBanner />
            <CorporateProcess />
            <CorporateTestimonials />
            <CorporateAboutUs />
            <CorporateCTA />
          </>
        );
      case "Debt Relief":
        return (
          <>
            <DebtHero />
            <DebtBanners />
            <DebtSelectService />
            <DebtPromotionalBanner />
            <DebtProcess />
            <DebtTestimonials />
            <DebtAboutUs />
            <DebtCTA />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
} 