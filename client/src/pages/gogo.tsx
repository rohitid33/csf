
import { Link } from "wouter";
import { useState } from "react";
import { servicesByCategory } from "@/data/services";
import SearchBar from "@/components/search/search-bar";

export default function GogoPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCategories = Object.entries(servicesByCategory).map(([category, services]) => ({
    category,
    services: services.filter(service => 
      service.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(({ services }) => services.length > 0);

  const hasResults = filteredCategories.length > 0;
  const allServices = Object.values(servicesByCategory).flat();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 w-full">
        <SearchBar 
          fullWidth={true}
          className="w-full"
          inputClassName="w-full"
          placeholder="Search all services..."
          onSearch={handleSearch}
          navigateOnSearch={false}
          initialValue={searchQuery}
        />
      </div>

      {!hasResults && searchQuery && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">No results found for "{searchQuery}"</h2>
          <p className="text-muted-foreground mb-6">Here are some popular services you might be interested in:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allServices.slice(0, 4).map((service) => (
              <Link key={service.title} href={service.link}>
                <a className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                  <span className="text-3xl mb-2">{service.icon}</span>
                  <span className="text-sm text-center font-medium">{service.title}</span>
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-12">
        {filteredCategories.map(({ category, services }) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-bold capitalize">{category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <Link key={service.title} href={service.link}>
                  <a className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                    <span className="text-3xl mb-2">{service.icon}</span>
                    <span className="text-sm text-center font-medium">{service.title}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
