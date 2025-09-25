# tunnel-link

Add a link on GitHub repo page to open/clone a repository in a vscode.dev tunnel

## Development setup

Code structure:
- Chrome extension entry: `chrome-ext/manifest.json` check links from there to figure out the functionality.
- VSCode Web extension entry: `vscode-ext/extension.js`.

Install VSCode Web extension:
- run `node ./serve-vscode-ext.mjs` to serve the web extension
- execute `Developer: Install Rxtension from Location...` in VSCode and enter `https://localhost:3000`

Install Chrome extension:
- go to `chrome://extensions` in chrome
- enable developer mode checkbox
- click `Load unpacked` and select `chrome-ext` folder in this repo
- click reload button on the extension page to sync changes
