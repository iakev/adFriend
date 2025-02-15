// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import WidgetContainer from './WidgetContainer';

const Content = () => {
  const [replacedElements, setReplacedElements] = useState([]);
  const [isReplacing, setIsReplacing] = useState(false);

  // Example content that simulates a real website
  const websiteContent = [
    { id: 1, type: 'text', content: 'Welcome to our website!' },
    { id: 2, type: 'heading', content: 'About Us' },
    { id: 3, type: 'paragraph', content: 'This is a sample paragraph that could be replaced with a quote.' },
    { id: 4, type: 'text', content: 'Another piece of content that can be replaced.' }
  ];

  const handleReplace = (id) => {
    if (replacedElements.includes(id)) {
      setReplacedElements(replacedElements.filter(elementId => elementId !== id));
    } else {
      setReplacedElements([...replacedElements, id]);
    }
  };

  const toggleReplaceMode = () => {
    setIsReplacing(!isReplacing);
    if (isReplacing) {
      setReplacedElements([]);
    }
  };

  const renderContent = (item) => {
    if (replacedElements.includes(item.id)) {
      return (
        <div className="relative" key={item.id}>
          <WidgetContainer widgetType="quotes" />
          {isReplacing && (
            <button 
              onClick={() => handleReplace(item.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded px-2 py-1 text-sm"
            >
              Restore
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="relative p-4 border rounded mb-4 bg-white" key={item.id}>
        {item.type === 'heading' && <h2 className="text-xl font-bold">{item.content}</h2>}
        {item.type === 'paragraph' && <p className="text-gray-700">{item.content}</p>}
        {item.type === 'text' && <div className="text-gray-600">{item.content}</div>}
        
        {isReplacing && (
          <button 
            onClick={() => handleReplace(item.id)}
            className="absolute top-2 right-2 bg-blue-500 text-white rounded px-2 py-1 text-sm"
          >
            Replace with Quote
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Website Content</h1>
        <button 
          onClick={toggleReplaceMode}
          className={`px-4 py-2 rounded ${
            isReplacing ? 'bg-gray-500' : 'bg-blue-500'
          } text-white`}
        >
          {isReplacing ? 'Done' : 'Replace Content'}
        </button>
      </div>

      <div className="border rounded-lg p-6 bg-gray-50">
        {websiteContent.map(item => renderContent(item))}
      </div>
    </div>
  );
};

export default Content;