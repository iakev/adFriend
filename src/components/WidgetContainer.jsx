// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import MotivationalQuoteWidget from './QuoteWidget';
import DailyRemindersWidget from './ReminderWidget';
import JokesWidget from './JokesWidget';
//import ArtWidget from './ArtsWidget';
//import TodoWidget from './TodoWidget';
import QuoteWidget from './QuoteWidget';

const WidgetContainer = ({ adSlotInfo }) => {
  const [gradient, setGradient] = useState('');

  // We'll only use the adSlotId from adSlotInfo and ignore the rect dimensions
  const { id: adSlotId } = adSlotInfo;

  const gradients = [
    'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
    'bg-gradient-to-r from-blue-500/20 to-teal-500/20',
    'bg-gradient-to-r from-orange-500/20 to-red-500/20',
    'bg-gradient-to-r from-green-500/20 to-emerald-500/20'
  ];

  const widgetComponents = {
    'quote': QuoteWidget,
    'motivational': MotivationalQuoteWidget,
    'reminders': DailyRemindersWidget,
    'jokes': JokesWidget,
  };

  const widgetTitles = {
    'quote': '📖 Quote of the Day',
    'motivational': '💪 Motivational Quote',
    'reminders': '📌 Daily Reminders',
    'jokes': '🤣 Daily Joke',
  };

  const widgetComponentsKeys = Object.keys(widgetComponents);

  useEffect(() => {
    setGradient(gradients[Math.floor(Math.random() * gradients.length)]);
  }, []);

  const index = Math.floor(Math.random() * widgetComponentsKeys.length);
  const SelectedWidgetKey = widgetComponentsKeys[index];
  const SelectedWidget = widgetComponents[SelectedWidgetKey];


  return (
    <div 
      className={`relative rounded-xl shadow-lg overflow-hidden
                  transition-all duration-300 ease-in-out
                  min-w-[280px] max-w-md w-fit
                  bg-white/5 backdrop-blur-sm ${gradient}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">
          {widgetTitles[SelectedWidgetKey]}
        </h2>
      </div>

      {/* Content */}
      <div className="p-4">
        <SelectedWidget adSlotId={adSlotId} />
      </div>
    </div>
  );
};

export default WidgetContainer;

