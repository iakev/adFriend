# Ad Space Reimagined - Chrome Extension

A Chrome extension that intelligently detects and replaces ad spaces with useful, interactive widgets while maintaining the original page layout.

## Features

- 🔍 **Smart Ad Detection**: Automatically identifies ad spaces on web pages
- 🎨 **Dynamic Widget Replacement**: Replaces ads with beautiful, gradient-styled widgets
- 🛡️ **Persistent Protection**: Maintains replacements even when ads try to reload
- 🎯 **Layout Preservation**: Keeps the page structure intact
- 🎪 **Shadow DOM Integration**: Ensures styles don't conflict with the main page
- 🌈 **Random Gradients**: Each widget gets a unique, aesthetically pleasing background
- 🎭 **Contrast Optimization**: Automatically adjusts text and button colors for readability (To be completed)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ad-space-reimagined.git
cd ad-space-reimagined
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` directory from your project

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm/yarn
- Chrome browser

### Project Structure
```
src/
├── components/          # React components
├── utils/              # Utility functions
├── background/         # Background script
├── content/           # Content scripts
└── manifest.json      # Extension manifest
```

### Key Components

#### ReplacementAd.jsx
The main component responsible for:
- Detecting ad spaces
- Creating widget mount points
- Managing widget lifecycle
- Handling cleanup

#### WidgetContainer.jsx
Manages:
- Widget rendering
- Gradient backgrounds
- Contrast calculations
- Component state

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

```

## How It Works

1. **Ad Detection**
   - Content script injects into web pages
   - Identifies iframes and common ad patterns
   - Determines appropriate replacement locations

2. **Widget Mounting**
   - Creates isolated mount points using Shadow DOM
   - Injects React components
   - Manages widget lifecycle

3. **Protection Mechanism**
   - Uses MutationObserver to detect changes
   - Automatically restores removed widgets
   - Handles cleanup on page changes

4. **Styling System**
   - Generates random gradients
   - Calculates contrast colors
   - Maintains consistent styling

## Configuration

### Manifest.json
```json
{
  "manifest_version": 3,
  "name": "adFriend",
  "version": "1.0.0",
  "action": { "default_popup": "index.html" },
  "permissions": ["activeTab", "scripting", "storage"],
  "host_permissions": ["<all_urls>"],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["src/content_scripts/main.jsx"]
    },
    {
      "matches": ["<all_urls>"],
      "js": ["src/content_scripts/iframe.jsx"],
      "all_frames": true,
      "match_about_blank": true
    }
  ],
  "background": {
    "service_worker": "src/background/background.js",
    "type": "module"
  },
  "web_accessible_resources": [
    {
      "resources": ["assets/*.svg"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### Customizing Gradients
Edit the gradients array in `ReplacementAd.jsx`:
```javascript
const gradientConfigs = [
  {
    gradient: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    contrast: '#2A2A2A'
  },
  // Add more gradients...
];
```

## Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/my-new-feature
```
3. Commit your changes:
```bash
git commit -am 'Add some feature'
```
4. Push to the branch:
```bash
git push origin feature/my-new-feature
```
5. Submit a pull request

## Testing

The extension includes unit tests using React testing library/jest-dom.

```bash
# Run all tests
npm run test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React team for the excellent framework
- Chrome Extensions team for the comprehensive API
- All contributors and supporters

## Contact

For issues and feature requests, please use the [GitHub issue tracker](https://github.com/yourusername/ad-space-reimagined/issues).
