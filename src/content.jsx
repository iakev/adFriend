import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
//import './index.css';
import AdDetector from './components/AdDetector';

console.log('Content script is starting to run!');

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed!");
});

// Wrap everything in a try-catch to catch any initialization errors
try {
  const hostElement = document.createElement("div");
  hostElement.id = "crx-root";
  const shadowRoot = hostElement.attachShadow({mode: 'closed'});
  
  // create mount point
  const mountPoint = document.createElement('div')
  shadowRoot.append(mountPoint);
  document.body.appendChild(hostElement);

  console.log('Host element created and appended to body');

  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    console.log('Attempting to create root and render');
    try {
      createRoot(mountPoint).render(
        <AdDetector />
      );
      console.log('React component rendered successfully');
    } catch (renderError) {
      console.error('Error rendering React component:', renderError);
    }
  }, 0);

  console.log('Content script initialization complete');
} catch (error) {
  console.error('Error in content script:', error);
}

