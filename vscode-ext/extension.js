const vscode = require("vscode");

// TODO: read from config
const BASE_FOLDER = "/home/glebbash/DEV";

module.exports.activate = async () => {
  const currentFolder = vscode.workspace.workspaceFolders?.[0].uri;
  if (
    currentFolder.scheme !== "vscode-remote" ||
    currentFolder.path !== BASE_FOLDER
  ) {
    return;
  }

  const repoUrl = new URLSearchParams(currentFolder.query).get("repo");
  if (!repoUrl) {
    return;
  }

  await openOrCloneRepo(currentFolder, repoUrl);
};

async function openOrCloneRepo(currentFolder, repoUrl) {
  const repoName = repoUrl.split("/").at(-1);
  let repoFolder = vscode.Uri.joinPath(currentFolder, repoName);

  let repoWasCloned = false;
  try {
    const stat = await vscode.workspace.fs.stat(repoFolder);
    repoWasCloned = stat.type === vscode.FileType.Directory;
  } catch {}

  if (repoWasCloned) {
    // drop `?path=...` from URI
    repoFolder = vscode.Uri.from({
      scheme: repoFolder.scheme,
      authority: repoFolder.authority,
      path: repoFolder.path,
    });

    await vscode.commands.executeCommand("vscode.openFolder", repoFolder, {
      forceReuseWindow: true,
    });
    return;
  }

  await vscode.commands.executeCommand("git.clone", repoUrl, BASE_FOLDER);
}
