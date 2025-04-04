import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useTickets } from '@/hooks/use-tickets';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useNotificationStore } from '@/stores/notification-store';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { addNotification } = useNotificationStore();

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user?.id) {
      console.log('No authenticated user, skipping WebSocket connection');
      return;
    }

    let reconnectTimeout: NodeJS.Timeout;
    const maxRetries = 5;
    let retryCount = 0;

    const connectWebSocket = () => {
      // Fix: Use the correct WebSocket URL that matches the server endpoint
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/api/notifications`;
      console.log('Connecting to WebSocket at:', wsUrl);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established successfully');
        retryCount = 0;
        
        // Send authentication message
        try {
          ws.send(JSON.stringify({
            type: 'AUTH',
            userId: user.id
          }));
        } catch (error) {
          console.error('Error sending auth message:', error);
        }
      };

      ws.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const data = JSON.parse(event.data);
          
          // Handle different types of notifications
          if (data.type === 'notification') {
            // Add to notification store
            addNotification({
              message: data.message,
              type: data.notificationType || 'info',
              taskId: data.taskId
            });
            
            // Show toast notification to the user
            toast({
              title: "Notification",
              description: data.message,
              variant: data.notificationType === 'error' ? 'destructive' : 'default',
            });
            
            // Refresh relevant data based on notification type
            if (data.taskId) {
              console.log('Task update notification received, refreshing data...');
              
              // Invalidate the specific ticket tasks cache
              // This will trigger a refetch in any component using useTicketTasks
              queryClient.invalidateQueries({ 
                predicate: (query) => {
                  const queryKey = query.queryKey[0];
                  return typeof queryKey === 'string' && queryKey.includes('/tasks');
                }
              });
              
              // Also invalidate the tickets list to update any status changes
              queryClient.invalidateQueries({ 
                queryKey: ['/api/tickets'] 
              });
            }
          } else if (data.type === 'TASK_UPDATE' || data.type === 'TICKET_UPDATE') {
            console.log('Task or Ticket update notification received');
            
            // Add to notification store
            addNotification({
              message: data.message || (data.type === 'TASK_UPDATE' ? 'A task has been updated' : 'Your ticket status has changed'),
              type: 'info',
              taskId: data.taskId
            });
            
            // Also show a toast for these notifications
            toast({
              title: data.type === 'TASK_UPDATE' ? "Task Updated" : "Ticket Updated",
              description: data.message || "Your ticket has been updated",
            });
            
            // Invalidate relevant queries
            if (data.ticketId) {
              queryClient.invalidateQueries({ 
                queryKey: [`/api/tickets/${data.ticketId}/tasks`] 
              });
            }
            
            // Always refresh tickets list for any update
            queryClient.invalidateQueries({ 
              queryKey: ['/api/tickets'] 
            });
          } else if (data.type === 'TICKETS_UPDATE') {
            // Add to notification store
            addNotification({
              message: data.message || 'Your tickets have been updated',
              type: 'info'
            });
            
            // Refresh the tickets list
            queryClient.invalidateQueries({ 
              queryKey: ['/api/tickets'] 
            });
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
          console.error('Raw message data:', event.data);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        // Implement exponential backoff for reconnection
        if (retryCount < maxRetries) {
          retryCount++;
          const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000);
          console.log(`Reconnecting in ${backoffTime}ms (attempt ${retryCount}/${maxRetries})...`);
          reconnectTimeout = setTimeout(connectWebSocket, backoffTime);
        } else {
          console.error('Max WebSocket reconnection attempts reached');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      console.log('Cleaning up WebSocket connection');
      clearTimeout(reconnectTimeout);
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [user?.id, queryClient, toast, addNotification]);

  return <>{children}</>;
}