// adapted from https://github.com/gitpod-io/browser-extension/blob/main/src/button/button-contributions.ts

addTunnelLink();

function addTunnelLink() {
  chrome.storage.sync.get("baseUrl", (data) => {
    if (!data.baseUrl) {
      return;
    }

    if (window.location.hostname === "github.com") {
      addTunnelLink(data.baseUrl);
      return;
    }

    if (window.location.hostname === "vscode.dev") {
      saveRepoUrlToIndexedDB(data.baseUrl);
      return;
    }
  });
}

function addTunnelLink(baseUrl) {
  const container = document.evaluate(
    "//*[contains(@id, 'repo-content-')]/div/div/div/div[1]/react-partial/div/div/div[2]/div[2]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  if (!container) {
    console.error("Target element not found for XPath.");
    return;
  }

  const tunnelLink = container.appendChild(document.createElement("a"));
  tunnelLink.id = "tunnel-link";
  tunnelLink.href = `${baseUrl}?repo=${window.location.href}`;
  tunnelLink.textContent = "Open in a Tunnel";

  const buttonStyle = document.head.appendChild(
    document.createElement("style")
  );
  buttonStyle.textContent = `
    #tunnel-link {
      font-weight: 500;
      border: 1px solid #ffac3eff;
      border-radius: 6px;
      background-color: #c8681fff;
      text-decoration: none;
      color: inherit;
      text-align: center;
      padding: 4px 12px;
    }
    #tunnel-link:hover,
    #tunnel-link:focus {
      background-color: #ff9b28ff;
      outline: none;
    }
  `;

  // make default code button secondary
  const defaultCodeButton = document.evaluate(
    "//button[contains(., 'Code')]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  if (defaultCodeButton) {
    defaultCodeButton.setAttribute("data-variant", "default");
  }
}

async function saveRepoUrlToIndexedDB(baseUrl) {
  // bail if we are not in the repo cloning folder
  const pageUrl = window.location.origin + window.location.pathname;
  if (pageUrl !== baseUrl) {
    return;
  }

  const repoUrl = new URLSearchParams(window.location.search).get("repo");
  if (repoUrl === undefined) {
    await saveValueToIDB("tunnel-link", "comms", "repoUrl", repoUrl);
  }
}

async function saveValueToIDB(dbName, storeName, key, value) {
  const db = await new Promise((res, rej) => {
    const req = indexedDB.open(dbName, 1);
    req.onupgradeneeded = (e) => e.target.result.createObjectStore(storeName);
    req.onsuccess = (e) => res(e.target.result);
    req.onerror = (e) => rej(e.target.error);
  });

  await new Promise((res, rej) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(value, key);
    tx.oncomplete = () => res();
    tx.onerror = (e) => rej(e.target.error);
  });
}
