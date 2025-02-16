// content-script.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ReplacementAd from '../components/ReplacementAd';
import ErrorBoundary from '../utils/ErrorBoundary';

// Initialize React app with shadow DOM
const initReactApp = () => {
  const hostElement = document.createElement("div");
  hostElement.id = "crx-root";
  const shadowRoot = hostElement.attachShadow({ mode: "closed" });

  const mountPoint = document.createElement("div");
  shadowRoot.append(mountPoint);
  document.body.appendChild(hostElement);

  createRoot(mountPoint).render(
    <StrictMode>
      <ErrorBoundary>
        <ReplacementAd />
      </ErrorBoundary>
    </StrictMode>
  );
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReactApp);
} else {
  initReactApp();
}