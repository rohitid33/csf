import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useNotificationStore } from "@/stores/notification-store";
import { 
  Menu, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  LogOut, 
  User as UserIcon,
  Bell,
  Search
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllServices } from "@/data/services-data";
import { ServiceData } from "@/components/services/service-template";

// More menu items
const moreMenuItems = [
  { title: "Home", link: "/" },
  { title: "About Us", link: "/about-us" },
  { title: "Events", link: "/events" },
  { title: "Products", link: "/products" },
  { title: "News", link: "/news" },
  { title: "Blog", link: "/blog" },
  { title: "Media", link: "/media" },
  { title: "Careers", link: "/careers" },
  { title: "Refer and Earn", link: "/refer" },
  { title: "Partner With Us", link: "/partner" },
  { title: "Talk to an Expert", link: "/talk-to-expert" }
];

export default function Navbar() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [services, setServices] = useState<ServiceData[]>([]);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const { notifications, markAllAsRead, unreadCount, removeNotification } = useNotificationStore();
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      }
    };
    
    fetchServices();
  }, []);
  
  const closeSheet = () => {
    if (sheetCloseRef.current) {
      sheetCloseRef.current.click();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Force a complete page reload and redirect to auth
      window.location.replace('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, force a reload to auth page
      window.location.replace('/auth');
    }
  };

  return (
    <div>
      <header className="relative z-50 bg-background/80 backdrop-blur-sm w-full">
        <div className="flex items-center justify-between p-2 w-full px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-lg">✓</span>
            </div>
            <div className="relative">
              <span className="font-bold text-xl text-primary">Claimsutra</span>
              <span className="absolute -top-1 -right-3 text-[10px] text-primary font-medium">TM</span>
            </div>
          </Link>
          
          <div className="flex items-center h-10 gap-3">
            {/* Notification Bell - shown for both logged in and logged out states */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="relative flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                  onClick={() => !user && setLocation('/auth')}
                >
                  <Bell className="h-5 w-5 text-primary" />
                  {user && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              {user ? (
                <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
                  <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-auto py-1 px-2 text-xs"
                      onClick={() => markAllAsRead()}
                    >
                      Mark all read
                    </Button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Notification items */}
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className={`flex flex-col items-start p-4 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                      >
                        <div className="flex items-start justify-between w-full gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground -mt-1 -mr-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <span className="sr-only">Dismiss</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </Button>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No notifications
                    </div>
                  )}
                  
                  {/* Footer section */}
                  <div className="text-xs text-center text-muted-foreground py-2 px-4 border-t">
                    Notifications will appear here when tasks are updated
                  </div>
                  <div className="text-xs text-center text-muted-foreground py-2 px-4 border-t">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-primary text-xs font-medium w-full"
                      onClick={() => {
                        setLocation('/notifications');
                      }}
                    >
                      Show All Notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              ) : null}
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className="flex items-center cursor-pointer">
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background"></div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {/* Format phone number with spaces */}
                        {user.username.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth" className="cursor-pointer flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 border border-primary/20">
                <UserIcon className="h-5 w-5 text-primary" />
              </Link>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <button className="hidden md:hidden flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 border border-primary/20">
                  <Menu className="h-5 w-5 text-primary" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetClose ref={sheetCloseRef} className="hidden" />
                </SheetHeader>
                
                <nav className="flex flex-col gap-4">
                  {/* More section with dropdown */}
                  <div className="border-t pt-4 mt-2">
                    <button 
                      className="flex items-center justify-between w-full text-left cursor-pointer hover:text-primary"
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    >
                      <span className="font-medium">More</span>
                      {isMoreMenuOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isMoreMenuOpen && (
                      <div className="mt-2 pl-4 flex flex-col gap-3 border-l">
                        {moreMenuItems.map((item) => (
                          <Link 
                            key={item.title} 
                            href={item.link}
                            className="text-sm hover:text-primary transition-colors"
                            onClick={() => {
                              setIsMoreMenuOpen(false);
                              closeSheet();
                            }}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <div className="w-full bg-primary/90 backdrop-blur-sm py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1">
            <p className="text-white text-xs font-medium flex items-center gap-2 pl-4">
              <span className="flex items-center justify-center bg-white rounded-full h-3 w-3 flex-shrink-0">
                <span className="text-primary text-[10px]">✓</span>
              </span>
              <span className="md:inline">
                India's Legal <span className="md:inline block">Expert</span>
              </span>
            </p>
          </div>
          
          {/* Floating separator */}
          <div className="h-5 w-[1px] bg-white/30 mx-2"></div>
          
          <div className="flex-1">
            <p className="text-white text-xs font-medium flex items-center gap-2">
              <span className="flex items-center justify-center bg-white rounded-full h-3 w-3 flex-shrink-0">
                <span className="text-primary text-[10px]">✓</span>
              </span>
              Trusted by 5,000+ Clients
            </p>
          </div>
          
          {/* Floating separator */}
          <div className="h-5 w-[1px] bg-white/30 mx-2"></div>
          
          <div className="flex-1">
            <p className="text-white text-xs font-medium flex items-center gap-2">
              <span className="flex items-center justify-center bg-white rounded-full h-3 w-3 flex-shrink-0">
                <span className="text-primary text-[10px]">✓</span>
              </span>
              One App, Multiple Legal Services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}