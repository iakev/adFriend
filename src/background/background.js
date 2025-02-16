chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message here:', message)
  if (message.type === 'IFRAME_AD_DETECTED') {
    if (!sender.tab) {
      console.error("No sender.tab found. Message ignored.");
      return;
    }

    // Store the frame data with a unique identifier
    const frameData = {
      frameId: sender.frameId,
      tabId: sender.tab.id,
      timestamp: Date.now(),
      ...message.data
    };

    // Forward to main content script with additional metadata
    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'MAIN_CONTENT_IFRAME_AD',
      data: frameData
    });

    sendResponse({ status: "success", message: "Iframe ad data forwarded" });
  } 

  else if (message.type === 'MAIN_CONTENT_ADS_TO_REPLACE') {
    console.log("Sending ads to content script:", message.data);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        console.error("No active tabs found.");
        sendResponse({ status: "error", message: "No active tabs found." });
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, {
        type: "ADS_TO_REPLACE",
        data: message.data.ads,
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending ads to content script:", chrome.runtime.lastError);
          sendResponse({ status: "error", message: chrome.runtime.lastError.message });
        } else {
          console.log("Ads sent successfully:", response);
          sendResponse({ status: "success", message: "Ads sent to content script" });
        }
      });
    });

    return true; // Indicates that sendResponse will be called asynchronously
  }
});
