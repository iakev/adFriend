import { useState, useEffect, useCallback } from "react";
import { createAdIconDetector, findIconsInElement } from "../utils/adDetectionUtils";

function useIframeAdSlotDetector() {
  const [adIcons, setAdIcons] = useState([]);
  const isAdIcon = useCallback(createAdIconDetector(), []);

  // Main function to detect ads in the iframe
  const detectAdsInIframe = useCallback(() => {
    try {
      // look for icons in current iframe's document
      const icons = findIconsInElement(document.body, isAdIcon);

      if (icons.length > 0) {
        setAdIcons(icons);
      }
    } catch (err) {
      console.error('Error detecting ads in iframe:', err);
    }
  }, [isAdIcon]);

  useEffect(() => {
    //initial detection when DOM is loaded
    if (document.readyState === 'complete') {
      detectAdsInIframe();
    } else {
      window.addEventListener('load', detectAdsInIframe);
      return () => window.removeEventListener('load', detectAdsInIframe);
    }

    const observer = new MutationObserver((mutations) => {
      // run detection on relevat changes
      const hasRelevantChanges = mutations.some(mutation => {
        return mutation.addedNodes.length > 0 || (mutation.type === 'attributes' &&
          ['class', 'style', 'src'].includes(mutation.attributeName));
      });

        if (hasRelevantChanges) {
          detectAdsInIframe();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'src']
    });

    return () => observer.disconnect();
  }, [detectAdsInIframe]);

  return {
    adIcons,
    isAdFrame: adIcons.length > 0
  };
}

export default useIframeAdSlotDetector;

