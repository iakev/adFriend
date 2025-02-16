// eslint-disable-next-line no-unused-vars
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
    <div className="w-full max-w-sm mx-auto">
      <ul className="space-y-3 mb-4">
        {reminders.map(reminder => (
          <li key={reminder.id}>
            <label className="flex items-center group w-full px-4 py-2.5 rounded-lg 
                            bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={reminder.completed}
                  onChange={() => toggleReminder(reminder.id)}
                  className="w-5 h-5 border-2 border-white/60 rounded
                            bg-transparent checked:bg-blue-500/80
                            checked:border-transparent hover:border-white/90 
                            focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 
                            transition-all duration-200 cursor-pointer"
                />
              </div>
              <span className={`ml-3 text-base ${
                reminder.completed 
                  ? 'text-white/50 line-through' 
                  : 'text-white/90'
              } transition-all duration-200`}>
                {reminder.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
      
      <div className="text-center">
        <p className="text-sm text-white/70">
          ✨ Make today count!
        </p>
      </div>
    </div>
  );
};

export default DailyRemindersWidget;

