import React from 'react';
import { useNotifications } from '../hooks/use-notifications';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // Initialize notifications
  useNotifications();

  return <>{children}</>;
} 