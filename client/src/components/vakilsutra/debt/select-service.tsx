import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CreditCard, PiggyBank, Shield, FileCheck, Phone, Scale } from "lucide-react";

const services = [
  {
    icon: CreditCard,
    title: "Credit Card Debt Relief",
    description: "Get relief from credit card debt and stop harassment calls",
    price: "Starting from ₹1,999",
    url: "/vakilsutra/debt/credit-card"
  },
  {
    icon: PiggyBank,
    title: "Personal Loan Settlement",
    description: "Settle your personal loans with better terms and lower EMIs",
    price: "Starting from ₹2,999",
    url: "/vakilsutra/debt/personal-loan"
  },
  {
    icon: Shield,
    title: "Anti-Harassment Service",
    description: "Stop recovery agent harassment with our AHS program",
    price: "Starting from ₹999",
    url: "/vakilsutra/debt/anti-harassment"
  },
  {
    icon: FileCheck,
    title: "Debt Consolidation",
    description: "Combine multiple debts into a single manageable payment",
    price: "Starting from ₹3,999",
    url: "/vakilsutra/debt/consolidation"
  },
  {
    icon: Phone,
    title: "Recovery Agent Protection",
    description: "Get protection from aggressive recovery agents",
    price: "Starting from ₹1,499",
    url: "/vakilsutra/debt/recovery-protection"
  },
  {
    icon: Scale,
    title: "Legal Consultation",
    description: "Get expert advice on debt resolution strategies",
    price: "Starting from ₹999",
    url: "/vakilsutra/debt/consultation"
  }
];

export default function DebtSelectService() {
  return (
    <section className="py-12" id="services">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-4"
        >
          Choose Your Debt Relief Solution
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Select the most suitable debt relief program for your situation. Our experts will guide you through the entire process.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <Icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">{service.price}</span>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = service.url}
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
} 