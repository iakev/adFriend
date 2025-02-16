// ReplacementAd.jsx
import React, { useEffect, useState, StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import WidgetContainer from "./WidgetContainer";
import ErrorBoundary from "../utils/ErrorBoundary";

// Loading component (can be moved to its own file if desired)
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%'
  }}>
    Loading widget...
  </div>
);

const ReplacementAd = () => {
  const [detectedAdSlots, setDetectedAdSlots] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("ReplacementAd mounted");
    setIsInitialized(true);

    const hasSibling = (element) => {
      return element.previousElementSibling !== null || element.nextElementSibling !== null;
    };

    const handleAdDetection = (message, sender) => {
      if (message.type === 'MAIN_CONTENT_IFRAME_AD') {
        const { iframeInfo, icons } = message.data;
        let iframe = document.getElementById(iframeInfo.id) || 
                    Array.from(document.getElementsByTagName('iframe'))
                         .find(frame => frame.src === iframeInfo.href);

        if (iframe) {
          let currentElement = iframe.parentElement;
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

              setDetectedAdSlots(prevSlots => {
                const newSlots = new Set(prevSlots);
                const isDuplicate = Array.from(newSlots).some(existingSlot =>
                  existingSlot.id === adSlotInfo.id &&
                  existingSlot.rect.width === adSlotInfo.rect.width &&
                  existingSlot.rect.height === adSlotInfo.rect.height &&
                  existingSlot.rect.top === adSlotInfo.rect.top &&
                  existingSlot.rect.left === adSlotInfo.rect.left
                );

                if (!isDuplicate) {
                  newSlots.add(adSlotInfo);
                  replaceAd(adSlotInfo);
                }
                return newSlots;
              });

              return true;
            }
            currentElement = currentElement.parentElement;
          }
        }
      }
    };

      // Add gradient options
    const gradients = [
      'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
      'linear-gradient(45deg, #7F7FD5, #86A8E7, #91EAE4)',
      'linear-gradient(45deg, #654ea3, #eaafc8)',
      'linear-gradient(45deg, #00B4DB, #0083B0)',
      'linear-gradient(45deg, #AD5389, #3C1053)',
      'linear-gradient(45deg, #20002c, #cbb4d4)',
      'linear-gradient(45deg, #2193b0, #6dd5ed)',
      'linear-gradient(45deg, #C33764, #1D2671)',
      'linear-gradient(45deg, #4568DC, #B06AB3)',
      'linear-gradient(45deg, #0F2027, #203A43, #2C5364)'
    ];

    const getRandomGradient = () => {
      return gradients[Math.floor(Math.random() * gradients.length)];
    };

    const replaceAd = (adSlotInfo) => {
      const element = adSlotInfo.element;
      if (element) {
        try {
          const existingMountPoint = element.querySelector('.replacement-widget');
          if (existingMountPoint) {
            console.warn("Removing existing widget before replacing...");
            existingMountPoint.remove();
          }
          // Clear the original content
          element.innerHTML = '';
          
          // Create a container for our React component
          const mountPoint = document.createElement('div');
          mountPoint.className = 'replacement-widget';
          mountPoint.style.cssText = `
            padding: 10px;
            position: relative;
            border-radius: 0.75rem;
            background: ${getRandomGradient()};
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(8px);
            overflow: hidden;
            color: white;
            transition: all 300ms ease-in-out;
          `;         
          element.appendChild(mountPoint);

          // Create a new React root and render the WidgetContainer
          const root = createRoot(mountPoint);
          root.render(
            <StrictMode>
              <ErrorBoundary>
                <React.Suspense fallback={<LoadingSpinner />}>
                  <WidgetContainer 
                    adSlotInfo={adSlotInfo}
                  />
                </React.Suspense>
              </ErrorBoundary>
            </StrictMode>
          );

          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === "childList") {
                mutation.removedNodes.forEach((node) => {
                  if (node === mountPoint) {
                    console.warn("Ad slot modification detected! Restoring widget.");
                    //Ensure not appending twice
                    if (!element.querySelector('.replacement-widget')) {
                      element.appendChild(mountPoint);
                    }
                  }
                });
              }
            });
          });

          observer.observe(element, { childList: true });

          // Store cleanup function
          const cleanup = () => {
            try {
              observer.disconnect();
              root.unmount();
              mountPoint.remove();
            } catch (error) {
              console.error('Error during cleanup:', error);
            }
          };

          // Add cleanup function to the element
          element._cleanupWidget = cleanup;
          
          // Notify background script about replacement
//          chrome.runtime.sendMessage({
//            type: 'AD_REPLACED',
//            data: { adSlotInfo }
//          });
        } catch (error) {
          console.error('Error replacing ad:', error);
        }
      }
    };

    // Listen for ad detections
    chrome.runtime.onMessage.addListener(handleAdDetection);
    
    // Initial ready message
    chrome.runtime.sendMessage({ type: "MAIN_PAGE_READY" });

    // Cleanup function
    return () => {
      chrome.runtime.onMessage.removeListener(handleAdDetection);
      // Cleanup all widget instances
      Array.from(detectedAdSlots).forEach(slot => {
        if (slot.element && slot.element._cleanupWidget) {
          slot.element._cleanupWidget();
        }
      });
    };
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <div id="replacement-ad-controller" style={{ display: 'none' }}>
      {/* This component manages ad replacements but doesn't render visible content */}
    </div>
  );
};

export default ReplacementAd;
