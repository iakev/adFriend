import { useEffect } from "react";
import useIframeAdSlotDetector from "../hooks/useIframeAdSlotDetector";

function IframeAdDetector() {
  const { adIcons, isAdFrame } = useIframeAdSlotDetector();

  useEffect(() => {

    if (isAdFrame && chrome.runtime) {
      const message = {
        type: 'IFRAME_AD_DETECTED',
        data: {
          icons: adIcons.map(icon => ({
            rect: icon.rect,
            type: icon.icon.tagName.toLowerCase(),
            className: icon.icon.className,
            id: icon.icon.id
          })),
          iframeInfo: {
            id: window.frameElement.id,
            href: window.location.href,
            origin: window.location.origin,
            size: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
            viewportRect: {
              width: document.documentElement.clientWidth,
              height: document.documentElement.clientHeight,
              scrollWidth: document.documentElement.scrollWidth,
              scrollHeight: document.documentElement.scrollHeight
            }
          }
        }
      };
      console.log('Iframe attempting to send Messsage:', message);
      chrome.runtime.sendMessage(message, respone => {
        const error = chrome.runtime.lastError;
        if (error) {
          console.error('Error sending from iframe:', error);
        } else {
          console.log('Succesfully sending from iframe, response', respone);
        }
      });
      console.log('Ad iframe detected with icons:', adIcons);
    } 
  }, [isAdFrame, adIcons]);

  // This component doesn't render anything
  return null;
}

export default IframeAdDetector;

