// eslint-disable-next-line no-unused-vars
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
        joke: data.joke,
        timestamp: Date.now()
      };
      
      localStorage.setItem(storageKey, JSON.stringify(jokeData));
      setJoke(jokeData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load joke');
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadStoredJoke = async () => {
      try {
        const storedJoke = JSON.parse(localStorage.getItem(storageKey));
        if (!storedJoke || Date.now() - storedJoke.timestamp > 24 * 60 * 60 * 1000) {
          await fetchJoke();
        } else {
          setJoke(storedJoke);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading stored joke:", err);
        setError('Failed to load stored joke');
        setLoading(false);
      }
    };

    loadStoredJoke();
  }, [adSlotId]);

  if (loading) return <div className="p-4">Loading joke...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {joke?.setup ? (
        <>
          <p className="text-lg font-medium text-white/90">{joke.setup}</p>
          <p className="text-base italic text-white/80">{joke.delivery}</p>
        </>
      ) : (
        <p className="text-lg font-medium text-white/90">{joke.joke}</p>
      )}
      <div className="pt-4">
        <span className="text-sm text-white/60">😆 Stay Laughing!</span>
      </div>
    </div>
  );
};
JokesWidget.widgetType = 'jokes';

export default JokesWidget;

