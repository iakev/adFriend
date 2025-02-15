import { createRoot } from 'react-dom/client';
import IframeAdDetector from "../components/IframeAdDetector";

if (window !== window.top) {
  try {
    const root = document.createElement('div');
    root.id = 'ad-friend-iframe-root';

    if (document.body) {
      document.body.appendChild(root);
      createRoot(root).render(<IframeAdDetector />);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(root);
        createRoot(root).render(<IframeAdDetector />);
      });
    }
  } catch (err) {
    console.error('AdFriend iframe script error:', err);
  }
}

