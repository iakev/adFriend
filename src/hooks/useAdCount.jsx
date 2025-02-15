import { useState, useEffect } from "react";

function useAdCount() {
  const [adCount, setAdCount] = useState(0);

  useEffect(() => {
    const messageListener = (message, sender, sendResponse) => {
      if (message.type === "UPDATE_AD_COUNT") {
        console.log("Received ad count update:", message.count);
        setAdCount(message.count);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    const requestAdCount = () => {
      chrome.tabs.query({ active: true, currentWindow: true}, (tabs) => {
        console.log('we have the tab as: ', tabs[0]);
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_AD_COUNT' }, (response) => {
            console.log('we have response as:', response);
            if (chrome.runtime.lastError) {
              console.error('Error sending message:', chrome.runtime.lastError);
            } else if (response) {
              setAdCount(response.count);
            }
          });
        }
      })
    }
    
    requestAdCount();

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    }

  }, []);

  return { adCount };
}

export default useAdCount;

