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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {renderContent()}
    </div>
  );
} 