import { useState, useEffect, useCallback } from "react";
import { createAdIconDetector, findIconsInElement } from "../utils/adDetectionUtils";

function useIframeAdSlotDetector() {
  const [adIcons, setAdIcons] = useState([]);
  const isAdIcon = useCallback(createAdIconDetector(), []);

  // Detect ads in the current document
  const detectAdsInIframe = useCallback(() => {
    try {
      // Look for ad icons in the document
      const icons = findIconsInElement(document.body, isAdIcon);

      if (icons.length > 0) {
        setAdIcons(icons);
      }
    } catch (err) {
      console.error("Error detecting ads in iframe:", err);
    }
  }, [isAdIcon]);

  useEffect(() => {
    // Initial detection when DOM is loaded
    if (document.readyState === "complete") {
      detectAdsInIframe();
    } else {
      window.addEventListener("load", detectAdsInIframe);
      return () => window.removeEventListener("load", detectAdsInIframe);
    }

    // Enhanced MutationObserver
    const observer = new MutationObserver((mutations) => {
      const hasRelevantChanges = mutations.some((mutation) => {
        return (
          mutation.addedNodes.length > 0 ||
          (mutation.type === "attributes" &&
            ["class", "style", "src"].includes(mutation.attributeName))
        );
      });

      if (hasRelevantChanges) {
        detectAdsInIframe();
        scanForDynamicIframes();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "src"],
    });

    // 🔹 Polling as a failsafe in case MutationObserver misses something
    const intervalId = setInterval(() => {
      detectAdsInIframe();
      scanForDynamicIframes();
    }, 3000); // Every 3 seconds (adjust as needed)

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [detectAdsInIframe]);

  // 🔹 Scan for dynamically injected iframes
  const scanForDynamicIframes = useCallback(() => {
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const icons = findIconsInElement(iframeDoc.body, isAdIcon);
          if (icons.length > 0) {
            setAdIcons((prevIcons) => [...prevIcons, ...icons]);
          }
        }
      } catch (err) {
        console.warn("Cannot access iframe due to cross-origin restrictions:", err);
      }
    });
  }, [isAdIcon]);

  return {
    adIcons,
    isAdFrame: adIcons.length > 0,
  };
}

export default useIframeAdSlotDetector;

