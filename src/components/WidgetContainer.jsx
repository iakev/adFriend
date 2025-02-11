import React, { useState } from 'react';
import MotivationalQuoteWidget from './QuoteWidget';
import DailyRemindersWidget from './RemindersWidget';
import JokesWidget from './JokesWidget';
import ArtWidget from './ArtWidget';
import TodoWidget from './TodoWidget';
import QuoteWidget from './QuoteWidget';

const WidgetContainer = ({ widgetType, adSlotId }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Widget configuration map
  const widgetComponents = {
    'quote': QuoteWidget,
    'todo': TodoWidget,
    'motivational': MotivationalQuoteWidget,
    'reminders': DailyRemindersWidget,
    'jokes': JokesWidget,
    'art': ArtWidget
  };

  // Widget titles map
  const widgetTitles = {
    'quote': 'Quote of the Day',
    'todo': 'Todo List',
    'motivational': 'Motivational Quote',
    'reminders': 'Daily Reminders',
    'jokes': 'Daily Joke',
    'art': 'Artistic Inspiration'
  };

  const SelectedWidget = widgetComponents[widgetType];

  if (!SelectedWidget) {
    return <div className="p-4 text-red-500">Unknown widget type: {widgetType}</div>;
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="widget-container border rounded-lg shadow-sm bg-white overflow-hidden">
      {/* Widget Header */}
      <div className="widget-header flex justify-between items-center p-2 bg-gray-50 border-b">
        <h2 className="text-sm font-medium text-gray-700">
          {widgetTitles[widgetType]}
        </h2>
        <button
          onClick={toggleMinimize}
          className="p-1 hover:bg-gray-200 rounded"
          title={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>

      {/* Widget Content */}
      {!isMinimized && (
        <div className="widget-content">
          <SelectedWidget adSlotId={adSlotId} />
        </div>
      )}
    </div>
  );
};

export default WidgetContainer;