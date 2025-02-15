import { useState, useEffect, useCallback, useRef } from "react";
import { createAdIconDetector, findIconsInElement } from "../utils/adDetectionUtils";

function useAdSlotDetector() {
  const [detectedAdSlots, setDetectedAdSlots] = useState([]);
  const observerRef = useRef(null);
  const isAdIcon = useCallback(createAdIconDetector(), []);

  const detectAdContainers = useCallback(() => {
    const icons = findIconsInElement(document.body, isAdIcon);
    const containers = findIconPairsAndContainers(icons);

    const uniqueContainers = Array.from(new Set(
      containers.map(({ container, rect }) => ({
        element: container,
        tagName: container.tagName,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        id: container.id || `unnamed-ad-${Math.random().toString().substring(2, 9)}`,
        className: container.className
      }))
    ));

    setDetectedAdSlots(prevAds => {
      const newAds = uniqueContainers.filter(newAd => 
        !prevAds.some(prevAd => prevAd.element === newAd.element)
      );
      return [...prevAds, ...newAds];
    });
  }, [isAdIcon]);

  useEffect(() => {
    if(document.readyState === 'complete') {
      detectAdContainers();
    } else {
      window.addEventListener('load', detectAdContainers);
    }

    const observer = new MutationObserver(() => {
      detectAdContainers();
    });

    observerRef.current = observer;
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener('load', detectAdContainers);
      if (observer.current) {
        observerRef.current.disconnect();
      }
    };
  }, [detectAdContainers]);

  return {
    detectedAdSlots,
    totalAds: detectedAdSlots.length
  };
};

export default useAdSlotDetector;

