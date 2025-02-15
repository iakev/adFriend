// content-script.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AdDetector from '../components/AdDetector';

const detectedAdSlots = new Set();

// Initialize React app with shadow DOM
const initReactApp = () => {
  const hostElement = document.createElement("div");
  hostElement.id = "crx-root";
  const shadowRoot = hostElement.attachShadow({ mode: 'closed' });
  
  const mountPoint = document.createElement('div');
  shadowRoot.append(mountPoint);
  document.body.appendChild(hostElement);
  
  createRoot(mountPoint).render(
    <StrictMode>
      <AdDetector />
    </StrictMode>
  );
};

const hasSibling = (element) => {
  return element.previousElementSibling !== null || element.nextElementSibling !== null;
};

// Listen for ad detections from iframes
chrome.runtime.onMessage.addListener((message, sender) => {
  
  if (message.type === 'MAIN_CONTENT_IFRAME_AD') {
    const { iframeInfo, icons } = message.data;
    
    // Find the iframe using multiple methods
    let iframe = null;
    
    // Try finding by ID first
    if (iframeInfo.id) {
      // Use getElementById instead of querySelector for IDs with special characters
      iframe = document.getElementById(iframeInfo.id);
    }
    
    // Fallback to finding by src if ID doesn't work
    if (!iframe && iframeInfo.href) {
      iframe = Array.from(document.getElementsByTagName('iframe'))
        .find(frame => frame.src === iframeInfo.href);
    }
    
    if (iframe) {
      // Start from the parent element
      let currentElement = iframe.parentElement;
      
      // Look for an ad slot container
      while (currentElement && currentElement !== document.body) {
        if (hasSibling(currentElement)) {
          const rect = currentElement.getBoundingClientRect();
          
          const adSlotInfo = {
            element: currentElement,
            rect: {
              width: rect.width,
              height: rect.height,
              top: rect.top,
              left: rect.left
            },
            id: currentElement.id,
            className: currentElement.className,
            iframe: iframeInfo,
            icons,
            timestamp: Date.now()
          };
          // Check if we already have this ad slot based on its properties
          const isDuplicate = Array.from(detectedAdSlots).some(existingSlot => 
            existingSlot.id === adSlotInfo.id &&
            existingSlot.rect.width === adSlotInfo.rect.width &&
            existingSlot.rect.height === adSlotInfo.rect.height &&
            existingSlot.rect.top === adSlotInfo.rect.top &&
            existingSlot.rect.left === adSlotInfo.rect.left
          );
          
          if (!isDuplicate) {
            detectedAdSlots.add(adSlotInfo);
          }
          
          console.log('Found ad slot:', adSlotInfo);
          const detectedAds = Array.from(detectedAdSlots);
          console.log('we have detected ads as: ', detectedAds);
          
          
          return true; // Stop listening after finding the ad slot
        }
        currentElement = currentElement.parentElement;
      }
    } else {
      console.log('Could not find iframe:', iframeInfo);
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReactApp);
} else {
  initReactApp();
}

