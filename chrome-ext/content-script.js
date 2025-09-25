// adapted from https://github.com/gitpod-io/browser-extension/blob/main/src/button/button-contributions.ts

main();

function main() {
  chrome.storage.sync.get("baseUrl", (data) => {
    if (!data.baseUrl) {
      return;
    }

    addTunnelLink(data.baseUrl);
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
    return;
  }

  const tunnelLink = container.appendChild(document.createElement("a"));
  tunnelLink.id = "tunnel-link";
  tunnelLink.href = `${baseUrl}?repo=${window.location.href}`;
  tunnelLink.textContent = "Jump In";

  document.head.appendChild(document.createElement("style")).textContent = `
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
