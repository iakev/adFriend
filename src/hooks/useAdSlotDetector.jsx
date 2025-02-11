import { useState, useEffect, useCallback, useRef } from "react";

function useAdSlotDetector() {
  const [detectedAdSlots, setDetectedAdSlots] = useState([]);
  const observerRef = useRef(null);
  const throttleTimeoutRef = useRef(null);

  const AD_NETWORKS = {
    google: {
      containers: ['google_ads_iframe', 'adsbygoogle', 'google-ad'],
      domains: ['doubleclick.net', 'googlesyndication.com'],
      attributes: ['data-ad-client', 'data-ad-slot']
    },
    amazon: {
      containers: ['amzn_assoc', 'amazon-ad'],
      domains: ['amazon-adsystem.com'],
      attributes: ['data-amzn']
    },
    facebook: {
      containers: ['fb-ad', 'facebook-ad'],
      domains: ['facebook.com/plugins'],
      attributes: ['data-ad-id']
    },
    taboola: {
      containers: ['taboola'],
      domains: ['taboola.com'],
      attributes: ['data-placement']
    }
  };

  const matchesAdNetwork = useCallback((element) => {
    if (!element) return 'unknown';
    const attrs = Array.from(element.attributes);
    const attributeUrls = attrs
      .map(attr => attr.value)
      .filter(value => value.includes('http://') || value.includes('https://'))
      .join(' '); // Join all URLs into one string for searching
    
    // Combine all possible URL sources
    console.log('attrUrls are: ', attributeUrls, element.src, element.href);
    const url = element.src || element.href || attributeUrls || '';
    return Object.keys(AD_NETWORKS).find(networkName => {
      const network = AD_NETWORKS[networkName];
      return (
        network.containers.some(container => 
          element?.id?.includes(container) || 
          element?.className?.includes(container)
        ) ||
        network.domains.some(domain => url.includes(domain)) ||
        network.attributes.some(attr => 
          attrs.some(a => a.name.includes(attr) || a.value.includes(attr))
        )
      );
    }) || 'unknown';
  }, []);

//  const isAdContainer = useCallback((el) => {
//    if (!el) return false;
//    const style = window.getComputedStyle(el);
//    const rect = el.getBoundingClientRect();
//
//    return (
//      (style.position !== 'static' && rect.width > 0 && rect.height > 0) ||
//      /ad|banner|sponsor/i.test(el.id) ||
//      /ad|banner|sponsor/i.test(el.className) ||
//      [
//        [728, 90], [300, 250], [160, 600], [336, 280],
//        [970, 250], [300, 600], [320, 50], [970, 90]
//      ].some(([w, h]) => 
//        Math.abs(rect.width - w) < 20 && Math.abs(rect.height - h) < 20
//      )
//    );
//  }, []);

  const isLikelyAdElement = useCallback((element) => {
    if (!element) return false;

    // Check element tag name
    const tagName = element.tagName.toLowerCase();
    const excludedTags = ['li','a', 'header', 'body', 'link'];
    if (excludedTags.includes(tagName)) {
      return false;
    }

    // Check for obvious non-ad indicators in class names and IDs
    const nonAdKeywords = [
      'reader',
      'sidebar',
      'article',
      'head',
      'script',
      'loader',
      'loading',
      'header',
      'navigation',
      'nav',
      'footer',
      'menu',
      'search'
    ];

    const hasNonAdClass = nonAdKeywords.some(keyword => 
      element.className.toLowerCase().includes(keyword) ||
      (element.id && element.id.toLowerCase().includes(keyword))
    );

    if (hasNonAdClass) {
      return false;
    }

    // Check parent elements for non-ad containers
    if (
      element.closest('aside') || 
      element.closest('.reader') || 
      element.closest('#reader') ||
      element.closest('.sidebar') ||
      element.closest('.article') ||
      element.closest('#article') ||
      element.closest('head') ||
      element.closest('script') ||
      element.closest('header') ||
      element.closest('.loader') ||
      element.closest('#loader') ||
      element.closest('nav') ||
      element.closest('.navigation') ||
      element.closest('#navigation') ||
      element.closest('footer')
    ) {
      return false;
    }

    return true;
  }, []);

  const traverseDOM = useCallback((node, initialTraversal = false) => {
    if (node.nodeType !== 1) return;

    // Check if the element has any attributes that contain ad-related keywords
    const hasAdAttribute = Array.from(node.attributes).some(attr =>
      /ad|banner|sponsor|promote/i.test(attr.name) ||
      /ad|banner|sponsor|promote/i.test(attr.value)
    );

    // During initial traversal, remove viewport check
    if (hasAdAttribute && (initialTraversal && isLikelyAdElement(node))) {
      const rect = node.getBoundingClientRect();
      setDetectedAdSlots(prevAds => {
        const exists = prevAds.some(ad => ad.id === node.id);
        if (!exists) {
          const network = matchesAdNetwork(node);
          return [
            ...prevAds,
            {
              element: node,
              tagName: node.tagName,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              top: Math.round(rect.top),
              left: Math.round(rect.left),
              network,
              id: node.id || `unnamed-ad-${Math.random().toString(36).substr(2, 9)}`,
              className: node.className
            }
          ];
        }
        return prevAds;
      });
    }

    // Recursively traverse child nodes
    node.childNodes.forEach(child => traverseDOM(child, initialTraversal));
  }, [matchesAdNetwork]);

  const updateDetectedAds = useCallback(() => {
    if (throttleTimeoutRef.current) return;

    throttleTimeoutRef.current = setTimeout(() => {
      traverseDOM(document.body);
      clearTimeout(throttleTimeoutRef.current);
      throttleTimeoutRef.current = null;
    }, 250);
  }, [traverseDOM]);

  useEffect(() => {
    // Initial ad detection after page load
    const handleInitialLoad = () => {
      // Perform initial comprehensive DOM traversal
      traverseDOM(document.body, true);

      // Setup MutationObserver for dynamic content changes
      const mutationObserver = new MutationObserver((mutations) => {
        if (mutations.some(mutation =>
          mutation.addedNodes.length > 0 &&
          Array.from(mutation.addedNodes).some(node =>
            node.nodeType === 1 && 
            Array.from(node.attributes).some(attr =>
              /ad|banner|sponsor|promote/i.test(attr.name) ||
              /ad|banner|sponsor|promote/i.test(attr.value)
            )
          )
        )) {
          updateDetectedAds();
        }
      });

      observerRef.current = mutationObserver;
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'id']
      });
    };

    // Add event listeners for different page load scenarios
    if (document.readyState === 'complete') {
      handleInitialLoad();
    } else {
      window.addEventListener('load', handleInitialLoad);
      document.addEventListener('DOMContentLoaded', handleInitialLoad);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('load', handleInitialLoad);
      document.removeEventListener('DOMContentLoaded', handleInitialLoad);
      
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [updateDetectedAds, traverseDOM]);

  return { 
    detectedAdSlots,
    totalAds: detectedAdSlots.length,
    adNetworks: detectedAdSlots.reduce((acc, slot) => {
      acc[slot.network] = (acc[slot.network] || 0) + 1;
      return acc;
    }, {})
  };
}

export default useAdSlotDetector;

