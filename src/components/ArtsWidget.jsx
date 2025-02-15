// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

const ArtWidget = ({ adSlotId }) => {
  const [art, setArt] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const storageKey = `art-${adSlotId}`;
  const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // You'll need to sign up for this

  const fetchArt = async () => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=artistic&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch art');
      
      const data = await response.json();
      const artData = {
        url: data.urls.small,
        author: data.user.name,
        authorLink: data.user.links.html,
        timestamp: Date.now()
      };
      
      await chrome.storage.local.set({ [storageKey]: artData });
      setArt(artData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load art');
      setLoading(false);
    }
  };

  const loadStoredArt = async () => {
    try {
      const result = await chrome.storage.local.get(storageKey);
      const storedArt = result[storageKey];
      
      // If no stored art or art is older than 24 hours, fetch new one
      if (!storedArt || Date.now() - storedArt.timestamp > 24 * 60 * 60 * 1000) {
        await fetchArt();
      } else {
        setArt(storedArt);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load stored art');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoredArt();
  }, [adSlotId]);

  if (loading) return <div className="p-4">Loading art...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <img 
        src={art?.url} 
        alt="Artistic inspiration" 
        className="w-full h-48 object-cover rounded"
      />
      <p className="mt-2 text-sm text-gray-600">
        Photo by{' '}
        <a 
          href={art?.authorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {art?.author}
        </a>
        {' '}on Unsplash
      </p>
    </div>
  );
};

export default ArtWidget;