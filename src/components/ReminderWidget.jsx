import React, { useState, useEffect } from 'react';

const DailyRemindersWidget = ({ adSlotId }) => {
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Meditation', completed: false },
    { id: 2, text: 'Movement', completed: false },
    { id: 3, text: 'Morning Pages', completed: false }
  ]);
  
  const storageKey = `reminders-${adSlotId}`;

  useEffect(() => {
    const loadReminders = async () => {
      const result = await chrome.storage.local.get(storageKey);
      const storedReminders = result[storageKey];
      
      // Reset reminders daily
      const today = new Date().toDateString();
      if (!storedReminders || storedReminders.date !== today) {
        const newReminders = {
          items: reminders.map(r => ({ ...r, completed: false })),
          date: today
        };
        await chrome.storage.local.set({ [storageKey]: newReminders });
        setReminders(newReminders.items);
      } else {
        setReminders(storedReminders.items);
      }
    };

    loadReminders();
  }, [adSlotId]);

  const toggleReminder = async (id) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    );
    
    await chrome.storage.local.set({
      [storageKey]: {
        items: updatedReminders,
        date: new Date().toDateString()
      }
    });
    
    setReminders(updatedReminders);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3">Daily Reminders</h3>
      <ul className="space-y-2">
        {reminders.map(reminder => (
          <li key={reminder.id} className="flex items-center">
            <input
              type="checkbox"
              checked={reminder.completed}
              onChange={() => toggleReminder(reminder.id)}
              className="mr-2"
            />
            <span className={reminder.completed ? 'line-through text-gray-500' : ''}>
              {reminder.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyRemindersWidget;