import React, { useState, useEffect } from 'react';

const JokesWidget = ({ adSlotId }) => {
  const [joke, setJoke] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const storageKey = `joke-${adSlotId}`;

  const fetchJoke = async () => {
    try {
      const response = await fetch('https://v2.jokeapi.dev/joke/Programming?safe-mode');
      if (!response.ok) throw new Error('Failed to fetch joke');
      
      const data = await response.json();
      const jokeData = {
        setup: data.setup,
        delivery: data.delivery,
        joke: data.joke, // for single-part jokes
        timestamp: Date.now()
      };
      
      await chrome.storage.local.set({ [storageKey]: jokeData });
      setJoke(jokeData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load joke');
      setLoading(false);
    }
  };

  const loadStoredJoke = async () => {
    try {
      const result = await chrome.storage.local.get(storageKey);
      const storedJoke = result[storageKey];
      
      // If no stored joke or joke is older than 24 hours, fetch new one
      if (!storedJoke || Date.now() - storedJoke.timestamp > 24 * 60 * 60 * 1000) {
        await fetchJoke();
      } else {
        setJoke(storedJoke);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load stored joke');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoredJoke();
  }, [adSlotId]);

  if (loading) return <div className="p-4">Loading joke...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {joke?.setup ? (
        // Two-part joke
        <>
          <p className="font-medium mb-2">{joke.setup}</p>
          <p className="italic">{joke.delivery}</p>
        </>
      ) : (
        // Single-part joke
        <p className="font-medium">{joke.joke}</p>
      )}
    </div>
  );
};

export default JokesWidget;