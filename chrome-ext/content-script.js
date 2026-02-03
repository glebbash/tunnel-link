// adapted from https://github.com/gitpod-io/browser-extension/blob/main/src/button/button-contributions.ts

main();

function main() {
  chrome.storage.sync.get("baseUrl", (data) => {
    if (!data.baseUrl) {
      return;
    }

    const tryInsert = () => addTunnelLink(data.baseUrl);

    // attempt immediately for already-loaded pages
    tryInsert();

    // observe DOM changes for SPA navigation / dynamic content
    const observer = new MutationObserver(() => {
      tryInsert();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // Fallback for late-rendered content
    setTimeout(tryInsert, 1000);
    setTimeout(tryInsert, 3000);
  });
}

function addTunnelLink(baseUrl) {
  const container = document.evaluate(
    "//*[contains(@id, 'repo-content-')]/div/div/div/div[1]/react-partial/div/div/div[2]/div[2]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
  if (!container) {
    return;
  }

  if (document.getElementById("tunnel-link")) {
    return;
  }

  const tunnelLink = container.appendChild(document.createElement("a"));
  tunnelLink.id = "tunnel-link";
  tunnelLink.href = `${baseUrl}?repo=${getRepoUrl(window.location.href)}`;
  tunnelLink.textContent = "Jump In";

  addTunnelLinkStyle();

  // make default code button secondary
  const defaultCodeButton = document.evaluate(
    "//button[contains(., 'Code')]",
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
  if (defaultCodeButton) {
    defaultCodeButton.setAttribute("data-variant", "default");
  }
}

function getRepoUrl(currentUrl) {
  try {
    const url = new URL(currentUrl);
    if (!url.hostname.endsWith("github.com")) {
      return url.origin + url.pathname;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `${url.origin}/${parts[0]}/${parts[1]}`;
    }

    return url.origin + url.pathname;
  } catch {
    return currentUrl;
  }
}

function addTunnelLinkStyle() {
  if (document.getElementById("tunnel-link-style")) {
    return;
  }

  const style = document.head.appendChild(document.createElement("style"));
  style.id = "tunnel-link-style";
  style.textContent = `
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
}
