import React, { useEffect } from "react";
import useAdSlotDetector from  "../hooks/useAdSlotDetector";

export default function AdDetector() {
  const { detectedAdSlots } = useAdSlotDetector();

  useEffect(() => {
    // Send ad count to popup whenever it changes
    //
    console.log('we have adslots as: ', detectedAdSlots);
    const messageListener = (message, sender, sendResponse) => {
      console.log('we have the message from useAdCount as:', message);
      if (message.type === 'GET_AD_COUNT') {
        console.log('Responding to GET_AD_COUNT');
        sendResponse({ count: detectedAdSlots?.length });
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    try {
      chrome.runtime.sendMessage({
        type: 'UPDATE_AD_CONUT',
        comut: detectedAdSlots?.length
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
        }
      });
    } catch (error) {
      console.error('Message sending error:', error);
    }

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [detectedAdSlots?.length]);


  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <h1 className="text-lg font-bold mb-2">Detected Ad Slots: {detectedAdSlots?.length}</h1>
      <div className="max-h-60 overflow-y-auto">
        {detectedAdSlots?.map((slot, index) => {
          <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
            <div className="font-bold">Ad Slot {index + 1}</div>
            <div className="text-sm text-gray-600">
              Size: {slot.width}x{slot.height}
            </div>
          </div>
        })}
      </div>
    </div>
  )
}

