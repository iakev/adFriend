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

});
