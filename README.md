# tunnel-link

Add a link on GitHub repo page to open/clone a repository in a vscode.dev tunnel

## Development setup

Code structure:
- Chrome extension entry: `chrome-ext/manifest.json` check links from there to figure out the functionality.
- VSCode Web extension entry: `vscode-ext/extension.js`.

### Chrome extension

#### Local installation
- go to `chrome://extensions` in chrome
- enable developer mode checkbox
- click `Load unpacked` and select `chrome-ext` folder in this repo
- click reload button on the extension page to sync changes

#### Publishing
- make sure to update version in `chrome-ext/manifest.json`
- create zip file of `chrome-ext` folder: `zip -r chrome-ext.zip chrome-ext`
- go to https://chrome.google.com/webstore/developer/dashboard
- click `Add new item`
- upload `chrome-ext.zip` file
- fill in all the details and publish

### VSCode Web extension

### Local installation
- run `node ./serve-vscode-ext.mjs` to serve the web extension
- execute `Developer: Install Rxtension from Location...` in VSCode and enter `https://localhost:3000`

### Publishing
- make sure to update version in `vscode-ext/package.json`
- run `cd vscode-ext && npm run package` to create a `.vsix` file
- go to https://marketplace.visualstudio.com/manage/publishers/<your-publisher-name>
- click `New Extension` and upload the `.vsix` file
