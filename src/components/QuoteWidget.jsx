// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Card, CardContent } from '@/components/ui/card';
// eslint-disable-next-line no-unused-vars
import { Loader2 } from 'lucide-react';

const MotivationalQuoteWidget = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuote = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://qapi.vercel.app/api/random');
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (err) {
      setError('Failed to load quote. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  // Expose test helpers on window object directly
  if (typeof window !== 'undefined') {
    window._testHelpers = {
      ...window._testHelpers,
      setQuoteState: setQuote,
      setAuthorState: setAuthor,
      setLoadingState: setIsLoading,
      setErrorState: setError,
      refetchQuote: fetchQuote
    };
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MotivationalQuoteWidget;