const vscode = require("vscode");

module.exports.activate = async () => {
  const config = vscode.workspace.getConfiguration("tunnel-link");
  const baseFolder = config.get("baseFolder");
  if (baseFolder === undefined) {
    return;
  }

  const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;
  if (
    workspaceUri?.scheme !== "vscode-remote" ||
    workspaceUri?.path !== baseFolder
  ) {
    return;
  }

  const repoUrl = new URLSearchParams(workspaceUri.query).get("repo");
  if (!repoUrl) {
    return;
  }

  await openOrCloneRepo(workspaceUri, baseFolder, repoUrl);
};

async function openOrCloneRepo(workspaceUri, baseFolder, repoUrl) {
  const repoName = repoUrl.split("/").at(-1);
  let repoFolder = vscode.Uri.joinPath(workspaceUri, repoName);

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

  await vscode.commands.executeCommand("git.clone", repoUrl, baseFolder);
}
