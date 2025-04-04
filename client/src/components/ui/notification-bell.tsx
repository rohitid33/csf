import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNotificationStore, Notification } from '@/stores/notification-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * NotificationBell component - Follows Single Responsibility Principle
 * Handles only the notification display and interaction logic
 */
export function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  // Mark notifications as read when dropdown opens
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      // Optional: Auto-mark as read when opened
      // markAllAsRead();
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  // Format notification time
  const formatNotificationTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short'
    });
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation logic based on notification type
    if (notification.taskId) {
      // Navigate to task detail page
      console.log(`Navigate to task: ${notification.taskId}`);
    }
  };

  // For debugging
  useEffect(() => {
    console.log("NotificationBell rendered", { notifications, unreadCount });
    
    // Add a test notification if there are none
    if (notifications.length === 0) {
      // Add test notification for development
      setTimeout(() => {
        addTestNotification();
      }, 2000);
    }
  }, [notifications]);

  // Add a test notification for development purposes
  const addTestNotification = () => {
    console.log("Adding test notification");
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('add-test-notification');
      window.dispatchEvent(event);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative inline-flex items-center justify-center">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[400px] overflow-y-auto">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              className="h-auto py-1 px-2 text-xs"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <p>No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-4 cursor-pointer",
                  !notification.read && "bg-muted/50"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex-1">
                    <p className={cn("text-sm", !notification.read && "font-medium")}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatNotificationTime(notification.createdAt)}
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
            ))}
          </>
        )}
        
        {/* Footer section */}
        <div className="text-xs text-center text-muted-foreground py-2 px-4 border-t">
          Notifications will appear here when tasks are updated
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
