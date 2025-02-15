chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'IFRAME_AD_DETECTED') {
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

    // Optionally store the frame data for persistence
//    chrome.storage.local.get(['adFrames'], (result) => {
//      const adFrames = result.adFrames || {};
//      const frameKey = `${sender.tab.id}-${sender.frameId}`;
//      adFrames[frameKey] = frameData;
//      
//      chrome.storage.local.set({ adFrames });
//    });
  }
});

