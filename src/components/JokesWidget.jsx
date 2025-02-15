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
    const storedJoke = JSON.parse(localStorage.getItem(storageKey));

    console.log("Stored joke:", storedJoke); // Debugging log

    // If no stored joke or joke is older than 24 hours, fetch a new one
    if (!storedJoke || Date.now() - storedJoke.timestamp > 24 * 60 * 60 * 1000) {
      console.log("Fetching a new joke...");
      await fetchJoke();
    } else {
      console.log("Using stored joke...");
      setJoke(storedJoke);
      setLoading(false);
    }
  } catch (err) {
    console.error("Error loading stored joke:", err); // Log error for debugging
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

JokesWidget.widgetType = 'jokes';

export default JokesWidget;