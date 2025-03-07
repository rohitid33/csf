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
            <div className="grid grid-cols-3 gap-4 max-h-48 overflow-y-auto">
              {filteredServices.map((service) => (
                <Link key={service.title} href={service.link}>
                  <a className="flex flex-col items-center p-2 border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                    <span className="text-2xl mb-1">{service.icon}</span>
                    <span className="text-xs text-center">{service.title}</span>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#002B4E] shadow-lg z-50 select-none">
        <div className="container mx-auto">
          <div className="grid grid-cols-5">
            <Link href="/">
              <a className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                location === '/' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <svg className="w-5 h-5 mb-1.5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[11px] font-medium text-center leading-tight">Home</span>
              </a>
            </Link>
            <Link href="/services">
              <a className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                location === '/services' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <svg className="w-5 h-5 mb-1.5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-[11px] font-medium text-center leading-tight">Services</span>
              </a>
            </Link>
            <Link href="/tickets">
              <a className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                location === '/tickets' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <div className="relative">
                  <svg className="w-5 h-5 mb-1.5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  {activeTicketCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {activeTicketCount > 9 ? '9+' : activeTicketCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-center leading-tight">Tickets</span>
              </a>
            </Link>
            <Link href="/consult">
              <a className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                location === '/consult' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <svg className="w-5 h-5 mb-1.5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-[11px] font-medium text-center leading-tight">Consult</span>
              </a>
            </Link>
            <Link href="/document-vault">
              <a className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                location === '/document-vault' ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'
              }`}>
                <svg className="w-5 h-5 mb-1.5" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[11px] font-medium text-center leading-tight">Docs</span>
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}