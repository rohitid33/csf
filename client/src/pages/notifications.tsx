import { useState, useEffect } from "react";
import { useNotificationStore } from "@/stores/notification-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Component to display a single notification
const NotificationItem = ({ 
  notification, 
  onDismiss 
}: { 
  notification: any;
  onDismiss: (id: string) => void;
}) => {
  const formattedDate = format(new Date(notification.createdAt), "PPp");
  
  return (
    <div className={`p-4 rounded-lg border mb-3 ${notification.read ? 'bg-card' : 'bg-muted/50 border-primary/20'}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-3">
          <div className={`rounded-full p-2 ${getNotificationTypeStyle(notification.type)}`}>
            {getNotificationIcon(notification.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{notification.message}</p>
              {!notification.read && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onDismiss(notification.id)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete notification</span>
        </Button>
      </div>
    </div>
  );
};

// Helper functions for notification styling and icons
function getNotificationTypeStyle(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-100 text-green-600';
    case 'error':
      return 'bg-red-100 text-red-600';
    case 'warning':
      return 'bg-yellow-100 text-yellow-600';
    case 'info':
    default:
      return 'bg-blue-100 text-blue-600';
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'success':
      return <CheckCheck className="h-4 w-4" />;
    case 'error':
      return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    case 'warning':
      return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
    case 'info':
    default:
      return <Bell className="h-4 w-4" />;
  }
}

// Main component that handles the notifications page logic
const NotificationsPage = () => {
  const { notifications, markAllAsRead, removeNotification } = useNotificationStore();
  const [filteredNotifications, setFilteredNotifications] = useState(notifications);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  // Update filtered notifications when notifications change or filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredNotifications(notifications);
    } else if (activeFilter === 'unread') {
      setFilteredNotifications(notifications.filter(n => !n.read));
    } else {
      setFilteredNotifications(notifications.filter(n => n.read));
    }
  }, [notifications, activeFilter]);
  
  // Count of different notification states
  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;
  
  return (
    <div className="container max-w-4xl py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            View and manage your notifications
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${activeFilter === 'all' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeFilter === 'unread' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${activeFilter === 'read' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveFilter('read')}
        >
          Read ({readCount})
        </button>
      </div>
      
      <div className="space-y-1">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onDismiss={removeNotification}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">No notifications</h3>
            <p className="text-muted-foreground mt-1">
              {activeFilter === 'all' 
                ? "You don't have any notifications yet" 
                : activeFilter === 'unread' 
                  ? "You don't have any unread notifications" 
                  : "You don't have any read notifications"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
