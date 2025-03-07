import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from './use-ticket-tasks';
import { useTickets } from './use-tickets';
import { useAuth } from './use-auth';
import { TaskNotification } from '@/components/ticket/TaskNotification';

// Mock function to simulate polling/websocket for new tasks
// In a real app, replace with WebSocket or polling implementation
const mockCheckForNewTasks = async (userId: string): Promise<{ticketId: string, task: Task}[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is just a mock - in a real app, you would fetch from your API
  return [];
};

interface TaskNotificationsContextType {
  hasNewTasks: boolean;
  markAllAsRead: () => void;
}

const TaskNotificationsContext = createContext<TaskNotificationsContextType | null>(null);

export function TaskNotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [hasNewTasks, setHasNewTasks] = useState(false);
  const [notifications, setNotifications] = useState<{ticketId: string, task: Task}[]>([]);
  
  // Poll for new tasks
  useEffect(() => {
    if (!user) return;
    
    const checkForNewTasks = async () => {
      try {
        const newTasks = await mockCheckForNewTasks(user.id);
        if (newTasks.length > 0) {
          setHasNewTasks(true);
          // Only add notifications we haven't shown yet
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.task.id));
            const uniqueNewTasks = newTasks.filter(n => !existingIds.has(n.task.id));
            return [...prev, ...uniqueNewTasks];
          });
        }
      } catch (error) {
        console.error('Error checking for new tasks:', error);
      }
    };
    
    // Initial check
    checkForNewTasks();
    
    // Set up polling interval - every 30 seconds
    const interval = setInterval(checkForNewTasks, 30000);
    return () => clearInterval(interval);
  }, [user]);
  
  const markAllAsRead = () => {
    setHasNewTasks(false);
  };
  
  const dismissNotification = (taskId: string) => {
    setNotifications(prev => prev.filter(n => n.task.id !== taskId));
  };
  
  return (
    <TaskNotificationsContext.Provider value={{ hasNewTasks, markAllAsRead }}>
      {children}
      
      {/* Render notifications */}
      {notifications.map((notification, index) => (
        <TaskNotification
          key={notification.task.id}
          ticketId={notification.ticketId}
          task={notification.task}
          onDismiss={() => dismissNotification(notification.task.id)}
        />
      ))}
    </TaskNotificationsContext.Provider>
  );
}

export function useTaskNotifications() {
  const context = useContext(TaskNotificationsContext);
  if (!context) {
    throw new Error('useTaskNotifications must be used within TaskNotificationsProvider');
  }
  return context;
}