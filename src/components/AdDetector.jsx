import React, { useEffect, useState } from "react";
import useAdSlotDetector from "../hooks/useAdSlotDetector";
import useIframeAdSlotDetector from "../hooks/useIframeAdSlotDetector";

export default function AdDetector() {
  const { detectedAdSlots } = useAdSlotDetector();
  const [iframeAds, setIframeAds] = useState([]);
  const allAds = [...(detectedAdSlots || []), ...(iframeAds || [])];

  useEffect(() => {
    // Tell service worker that main page is ready
    chrome.runtime.sendMessage({ type: 'MAIN_PAGE_READY' });

    // Listen for iframe ad updates
    const messageListener = (message, sender, sendResponse) => {
      if (message.type === 'IFRAME_ADS_UPDATE') {
        setIframeAds(message.data);
      } else if (message.type === 'GET_AD_COUNT') {
        sendResponse({ count: allAds.length });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    // Update total ad count
    chrome.runtime.sendMessage({
      type: 'UPDATE_AD_COUNT',
      count: allAds.length
    });

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [allAds.length]);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <h1 className="text-lg font-bold mb-2">
        Total Detected Ads: {allAds.length}
      </h1>
      <div className="text-sm mb-2">
        Main Page: {detectedAdSlots?.length || 0}
        <br />
        Iframes: {iframeAds?.length || 0}
      </div>
      <div className="max-h-60 overflow-y-auto">
        {allAds.map((ad, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
            <div className="font-bold">Ad {index + 1}</div>
            <div className="text-sm text-gray-600">
              Size: {ad.width}x{ad.height}
              {ad.isIframe && <span className="ml-2">(iframe)</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

