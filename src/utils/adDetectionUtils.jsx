export const createAdIconDetector = () => {
  return (element) => {
    // Helper function to check for Google Ads info icon URL
    const isGoogleAdsInfoIcon = (url) => {
        return url.includes('tpc.googlesyndication.com/pagead/images/abg/icon');
    };

    // Check for amp-img elements (specific to AMP ads)
    if (element.tagName.toLowerCase() === 'amp-img') {
        const src = element.getAttribute('src') || '';
        return isGoogleAdsInfoIcon(src);
    }

    // Check for SVGs
    if (element.tagName.toLowerCase() === 'svg') {
        const ariaLabel = element.getAttribute('aria-label') || '';
        const classNames = element.classList ? Array.from(element.classList).join(' ') : '';
        
        // Check style dimensions - many ad icons are 15x15
        const style = element.getAttribute('style') || '';
        const hasAdDimensions = style.includes('width:15px') && style.includes('height:15px');
        
        // Check existing conditions
        const isCloseIcon =
            ariaLabel.toLowerCase().includes('close') ||
            classNames.toLowerCase().includes('close');
        const isInfoIcon =
            ariaLabel.toLowerCase().includes('info') ||
            classNames.toLowerCase().includes('info');
            
        // Check SVG paths
        const paths = element.getElementsByTagName('path');
        const commonClosePaths = [
            'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
            'M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z',
            'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
            'M0,0l15,0l0,15l-15,0Z',
            'M3.25,3.25l8.5,8.5M11.75,3.25l-8.5,8.5'
        ];
        
        const commonInfoPaths = [
            'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
            'M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z'
        ];
        
        // Check if any path matches common close/info icons
        let hasMatchingPath = false;
        for (const path of paths) {
            const pathData = path.getAttribute('d');
            const strokeColor = path.getAttribute('stroke');
            
            if (pathData) {
                const normalizedPath = pathData.replace(/\s+/g, '');
                const isPathClose = commonClosePaths.some(commonPath => 
                    normalizedPath === commonPath.replace(/\s+/g, '')
                );
                const isPathInfo = commonInfoPaths.some(commonPath => 
                    normalizedPath === commonPath.replace(/\s+/g, '')
                );
                
                // Additional check for specific ad close icon pattern
                const isAdCloseIcon = strokeColor === '#00aecd' && 
                    (normalizedPath.includes('M3.25,3.25l8.5,8.5') || 
                     normalizedPath.includes('M11.75,3.25l-8.5,8.5'));
                
                if (isPathClose || isPathInfo || isAdCloseIcon) {
                    hasMatchingPath = true;
                    break;
                }
            }
        }
        
        return isCloseIcon || isInfoIcon || hasMatchingPath || hasAdDimensions;
    }

    // Check for regular images
    if (element.tagName.toLowerCase() === 'img') {
        const src = element.src || '';
        const alt = element.alt || '';
        const isCloseIcon =
            src.toLowerCase().includes('close') ||
            alt.toLowerCase().includes('close');
        const isInfoIcon =
            src.toLowerCase().includes('info') ||
            alt.toLowerCase().includes('info') ||
            isGoogleAdsInfoIcon(src);
        return isCloseIcon || isInfoIcon;
    }

    if (element.tagName.toLowerCase() === 'i') {
        const classNames = element.classList ? Array.from(element.classList).join(' ') : '';
        const isCloseIcon = classNames.toLowerCase().includes('close');
        const isInfoIcon = classNames.toLowerCase().includes('info');
        return isCloseIcon || isInfoIcon;
    }

    if (element.textContent) {
        const text = element.textContent.trim();
        const isCloseIcon = text === '✕' || text === '×';
        const isInfoIcon = text === 'ⓘ';
        return isCloseIcon || isInfoIcon;
    }

    return false;
    }
};

export const findIconsInElement = (element, isAdIcon) => {
  const icons = [];
  
  const processIcon = (icon) => {
    const rect = icon.getBoundingClientRect();
    icons.push({
      icon,
      rect: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left)
      }
    });
  };

  if (isAdIcon(element)) {
    processIcon(element);
  }

  element.querySelectorAll('svg, img, i').forEach(child => {
    if (isAdIcon(child)) {
      processIcon(child);
    }
  });

  return icons;
};

export const findIconPairsAndContainers = (icons) => {
  // Find pairs of icons that are likely part of the same ad unit
  const iconPairs = [];
  for (let i = 0; i < icons.length; i++) {
    for (let j = i + 1; j < icons.length; j++) {
      const icon1 = icons[i];
      const icon2 = icons[j];
      
      // Calculate distances between icons
      const horizontalDistance = Math.abs(icon1.rect.left - icon2.rect.left);
      const verticalDistance = Math.abs(icon1.rect.top - icon2.rect.top);
      
      // More flexible proximity check - icons can be within reasonable distance
      // either horizontally or vertically
      if (
        (horizontalDistance < 50 && verticalDistance < 20) || // Icons side by side
        (verticalDistance < 50 && horizontalDistance < 20)    // Icons stacked
      ) {
        iconPairs.push([icon1.icon, icon2.icon]);
      }
    }
  }

  // Find ad containers by traversing up from icon pairs
  const containers = iconPairs
    .map(([icon1, icon2]) => {
      // Start from the icons
      let container1 = icon1;
      let container2 = icon2;
      
      // Find common ancestor
      while (container1 && container2) {
        if (container1.parentElement === container2.parentElement) {
          let adContainer = container1.parentElement;
          // Traverse up until we find a suitable container
          while (adContainer && adContainer !== document.body) {
            const rect = adContainer.getBoundingClientRect();
            
            // Check if this could be an ad container based on various heuristics
            const isLikelyAdContainer = (
              // Has siblings (not the only element)
              (adContainer.previousElementSibling || adContainer.nextElementSibling) &&
              // Reasonable size for an ad
              rect.width > 100 && 
              rect.height > 50 &&
              // Not too large
              rect.width < window.innerWidth &&
              rect.height < window.innerHeight
            );

            if (isLikelyAdContainer) {
              return {
                container: adContainer,
                rect: {
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                  top: Math.round(rect.top),
                  left: Math.round(rect.left)
                },
                iconPair: [icon1, icon2] // Keep reference to the icons that identified this container
              };
            }
            
            adContainer = adContainer.parentElement;
          }
          break;
        }
        container1 = container1.parentElement;
        container2 = container2.parentElement;
      }
      return null;
    })
    .filter(Boolean);
  return containers;
};

