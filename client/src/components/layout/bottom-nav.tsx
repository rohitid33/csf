import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTickets } from "@/hooks/use-tickets";
import { useAuth } from "@/hooks/use-auth";

export default function BottomNav() {
  const [location] = useLocation();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { tickets, isLoading } = useTickets();
  const { user } = useAuth();

  const services = [
    { title: "Health Insurance", link: "/service/health-claim", icon: "🏥" },
    { title: "Car Insurance", link: "/service/motor-claim", icon: "🚗" },
    { title: "Life Insurance", link: "/service/life-claim", icon: "👥" },
    { title: "Property Insurance", link: "/service/property-claim", icon: "🏠" },
    { title: "Travel Insurance", link: "/service/travel-claim", icon: "✈️" },
    { title: "Fire Insurance", link: "/service/fire-claim", icon: "🔥" },
  ];

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate number of active tickets
  const activeTicketCount = user && !isLoading ? tickets.filter(ticket => 
    ticket.status === 'new' || ticket.status === 'processing').length : 0;

  return (
    <>
      {isServicesOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setIsServicesOpen(false)}>
          <div className="fixed bottom-16 left-0 right-0 bg-[#002B4E] border-t border-white/10 p-4 z-50" onClick={e => e.stopPropagation()}>
            <input
              type="search"
              placeholder="Search services..."
              className="w-full p-2 mb-4 border rounded-md bg-white/90 appearance-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="grid grid-cols-4 gap-3 max-h-[calc(100vh-250px)] overflow-y-auto pb-safe">
              {filteredServices.map((service) => (
                <Link key={service.title} href={service.link}>
                  <a className="flex flex-col items-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 active:scale-95">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center mb-2 shadow-lg">
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <span className="text-xs text-center text-white font-medium line-clamp-2">
                      {service.title}
                    </span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#002B4E] shadow-lg z-50 select-none">
        <div className="container mx-auto">
          <div className="grid grid-cols-4">
            <Link href="/">
              <a className={`flex flex-col items-center justify-center py-3 px-1 transition-all duration-200 ${
                location === '/' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <svg className="w-6 h-6 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-xs font-medium text-center leading-tight">Home</span>
              </a>
            </Link>
            <Link href="/services">
              <a className={`flex flex-col items-center justify-center py-3 px-1 transition-all duration-200 ${
                location === '/services' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <svg className="w-6 h-6 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-xs font-medium text-center leading-tight">All Services</span>
              </a>
            </Link>
            <Link href="/tickets">
              <a className={`flex flex-col items-center justify-center py-3 px-1 transition-all duration-200 ${
                location === '/tickets' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <div className="relative">
                  <svg className="w-6 h-6 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  {activeTicketCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {activeTicketCount > 9 ? '9+' : activeTicketCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium text-center leading-tight">Tickets</span>
              </a>
            </Link>
            <Link href="/consult">
              <a className={`flex flex-col items-center justify-center py-3 px-1 transition-all duration-200 ${
                location === '/consult' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <svg className="w-6 h-6 mb-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-xs font-medium text-center leading-tight">Consult</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}