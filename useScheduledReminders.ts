
import { useState, useEffect, useRef } from 'react';

type ReminderType = 'morning' | 'evening' | null;

export const useScheduledReminders = () => {
  const [reminderType, setReminderType] = useState<ReminderType>(null);
  const lastNotificationRef = useRef<string | null>(null);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const todayStr = now.toDateString();

      // Morning Window: 8 AM - 9 AM
      if (hour === 8) {
        setReminderType('morning');
        triggerSystemNotification(
            'Morning Alignment', 
            'The sun rises. Define your intent for the day.', 
            todayStr + '_morning'
        );
      } 
      // Evening Window: 6 PM - 8 PM
      else if (hour >= 18 && hour < 20) {
        setReminderType('evening');
        triggerSystemNotification(
            'Evening Review', 
            'The day ends. Log your discipline and reflect.', 
            todayStr + '_evening'
        );
      } else {
        setReminderType(null);
      }
    };

    // Check immediately, then every minute
    checkTime();
    const interval = setInterval(checkTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const triggerSystemNotification = (title: string, body: string, key: string) => {
    // Prevent spamming the same notification in the same session
    if (lastNotificationRef.current === key) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Komorebi OS: ${title}`, {
          body,
          icon: 'https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/sun.svg', // Generic icon fallback
          silent: false
        });
        lastNotificationRef.current = key;
      } catch (e) {
        console.log("Notification failed", e);
      }
    }
  };

  const dismissReminder = () => setReminderType(null);

  return { reminderType, dismissReminder };
};
