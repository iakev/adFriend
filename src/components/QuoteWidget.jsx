// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

const QuoteWidget = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const url = 'https://famous-quotes4.p.rapidapi.com/random?category=all&count=2';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'a7cdea77d7msh8687ccdc0fb77a9p1233e9jsn3728a938f700',
      'x-rapidapi-host': 'famous-quotes4.p.rapidapi.com'
    }
  };

  const fetchQuote = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const response = await fetch(url, options);
      if (!response.ok) {
        const advice  = await fetch('https://api.adviceslip.com/advice');
        const result = await advice.json();
        setQuote(result.slip.advice);
        setAuthor(null);
      } else {
        const result = await response.json();
        const randomQuote = result[Math.floor(Math.random() * 1)];
        setQuote(randomQuote.text);
        setAuthor(randomQuote.author);
      }
  
    } catch (err) {
      setError('Failed to load quote. Please try again later.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
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
      <div className="w-full max-w-sm mx-auto space-y-6">
        <div className="space-y-4">
          <p className="text-lg font-medium text-white/90 leading-relaxed" data-testid="quote-text">
          "{quote}"
          </p>
          {author &&(
            <p className="text-sm text-white/70 text-right italic" data-testid="quote-author">
              — {author}
            </p>
          )}
        </div>
      
        <button 
          onClick={fetchQuote}
          disabled={isRefreshing}
          className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                   transition-colors duration-200 text-white/90 text-sm
                   flex items-center justify-center gap-2 disabled:opacity-50"
        >
          New Quote
        </button>
      </div>)}
    </div>
 );
};
QuoteWidget.widgetType = 'quote';

export default QuoteWidget;

