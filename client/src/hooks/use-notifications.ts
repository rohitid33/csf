import { useEffect } from 'react';
import { useAuth } from './use-auth';
import { useNotificationStore } from '@/stores/notification-store';

export function useNotifications() {
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!user) return;

    // Determine WebSocket protocol based on current window protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/notifications`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          addNotification({
            message: data.message,
            type: data.notificationType || 'info',
            taskId: data.taskId,
          });
        }
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup on unmount or when user changes
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user, addNotification]);
} 