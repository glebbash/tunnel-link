main();

function main() {
  const baseUrlInput = document.getElementById("baseUrlInput");

  chrome.storage.sync.get("baseUrl", (data) => {
    baseUrlInput.value = data.baseUrl || "";
  });

  document
    .getElementById("saveSettingsButton")
    .addEventListener("click", () => {
      chrome.storage.sync.set({ baseUrl: baseUrlInput.value }, () => {
        alert("Settings saved!");
      });
    });
}
