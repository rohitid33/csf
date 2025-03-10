import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">All Services</h1>
      
      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full transition-all duration-200"
          />
        </div>
      </div>
      
      {/* Empty state */}
      <div className="text-center text-gray-500 mt-8">
        <p>New services page coming soon!</p>
      </div>
    </div>
  );
}