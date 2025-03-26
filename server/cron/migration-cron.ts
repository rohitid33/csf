import cron from 'node-cron';
import { MigrationService } from '../services/migration-service';

// Run reminder checks daily at midnight
const reminderCron = cron.schedule('0 0 * * *', async () => {
  console.log('Running password migration reminders...');
  try {
    await MigrationService.processReminders();
    console.log('Password migration reminders completed successfully');
  } catch (error) {
    console.error('Error processing password migration reminders:', error);
  }
});

// Run password deletion checks daily at 1 AM
const deletionCron = cron.schedule('0 1 * * *', async () => {
  console.log('Processing password deletions for expired migrations...');
  try {
    await MigrationService.processPasswordDeletion();
    console.log('Password deletion process completed successfully');
  } catch (error) {
    console.error('Error processing password deletions:', error);
  }
});

export function startMigrationCron() {
  console.log('Starting password migration cron jobs...');
  reminderCron.start();
  deletionCron.start();
}

export function stopMigrationCron() {
  console.log('Stopping password migration cron jobs...');
  reminderCron.stop();
  deletionCron.stop();
} 