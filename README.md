# DarkModeExt

## Overview
DarkModeExt is a browser extension that allows users to toggle dark mode on any website. It helps reduce eye strain by applying a dark theme to web pages, making browsing more comfortable in low-light environments. This extension works on most modern browsers that support extensions.

## Features
- Applies dark mode styles to any website
- Simple and intuitive toggle interface
- Custom CSS injection for improved readability
- Lightweight and fast
- Built with standard web extension technologies (HTML, CSS, JavaScript)

## Installation
To install the extension for development:

1. Clone the repository:
   `git clone https://github.com/robu9/DarkModeExt.git`
   `cd DarkModeExt`

2. Open your browser’s extensions page:
   - Chrome: `chrome://extensions/`
   - Firefox: `about:debugging#/runtime/this-firefox`

3. Enable developer mode.

4. Load the extension folder (`DarkModeExt`) as an unpacked extension.

## Usage
Once the extension is installed:
- Click the DarkModeExt icon in the browser toolbar.
- Use the toggle switch to enable or disable dark mode for the current website.
- The extension will apply a dark style overlay on the page.

## Supported Browsers
DarkModeExt is compatible with browsers that support the WebExtensions API, including:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge

## Extension Structure
- `manifest.json` — configuration and permissions for the extension
- `content.js` — script that applies dark styles to web pages
- `popup.html` — user interface for the extension popup
- `popup.js` — logic for dark mode toggle
- `popup.css` — styling for the popup interface

## Customization
Users can modify dark mode styles by editing the CSS in `content.js` or adding additional styles in the extension settings. You can add site-specific rules to improve appearance for particular pages.

## Development
To contribute or improve DarkModeExt:
1. Fork the repository.
2. Create a new branch: (`git checkout -b feature-name`)
3. Make your changes.
4. Test the extension manually in developer mode.
5. Submit a pull request with a clear description of your changes.

## License
This project is open source and available under the MIT License.

## Contact
For issues, suggestions, or questions, please open an issue on the GitHub repository.
