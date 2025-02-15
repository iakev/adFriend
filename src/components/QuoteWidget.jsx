// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

const QuoteWidget = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://zenquotes.io/api/quotes');
      if (!response.ok) throw new Error('Failed to fetch quote');
  
      const data = await response.json();
      setQuote(data.content);  // `content` should be `data.content`
      setAuthor(data.author);  // `author` should be `data.author`
  
    } catch (err) {
      setError('Failed to load quote. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center" data-testid="error-message">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-lg font-medium" data-testid="quote-text">
            "{quote}"
          </p>
          <p className="text-sm text-gray-500 text-right" data-testid="quote-author">
            - {author}
          </p>
          <button 
            onClick={fetchQuote}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
          >
            New Quote
          </button>
        </div>
      )}
    </div>
  );
};

QuoteWidget.widgetType = 'quote';

export default QuoteWidget;