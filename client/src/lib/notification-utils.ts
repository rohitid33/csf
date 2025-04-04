import { useNotificationStore } from '@/stores/notification-store';

/**
 * Utility function to add a test notification to the notification store
 * This follows the Single Responsibility Principle by focusing only on notification generation
 */
export function setupTestNotifications() {
  // Add event listener for test notifications
  if (typeof window !== 'undefined') {
    window.addEventListener('add-test-notification', () => {
      const store = useNotificationStore.getState();
      
      // Only add test notification if we don't already have notifications
      if (store.notifications.length === 0) {
        // Add a test notification
        store.addNotification({
          message: 'Test notification: A task has been updated',
          type: 'info',
          taskId: 'test-task-123'
        });
      }
    });
  }
}

/**
 * Trigger a test notification manually
 */
export function triggerTestNotification() {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('add-test-notification');
    window.dispatchEvent(event);
  }
}
