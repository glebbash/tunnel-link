# tunnel-link: link from any github repo to your vscode tunnel

This VSCode Web extension will opens or clones a GitHub repository in a tunnel when specific `tunnel-link.baseFolder` is opened and the URL contains `?repo=...` query parameter with repo url.

## Configuration

Base folder can be set using `tunnel-link.baseFolder` setting. By default it is not defined so this extension will not do anything.

## Companion `tunnel-link` extension for Chrome

Search chrome web store for the `tunnel-link` extension. It will add a link on GitHub repository page that you can point to your vscode.dev tunnel's base folder where your repositories live.

## Example setup

Your tunnel name is `https://vscode.dev/tunnel/dev`.

Your user name in the tunnel is `user`.

Your `tunnel-link.baseFolder` is set to `/home/user/DEV`.

When you open this URL in your browser either via the chrome extension button or by just entering it manually:
`https://vscode.dev/tunnel/dev/home/user/DEV?repo=https://github.com/user/dotfiles`

What will happen is:
- vscode.dev opens `/home/user/DEV` folder in the `dev` tunnel
- `tunnel-link` extension is activated because of the matching `baseFolder` and `?repo=...` query parameter is present
  - if `https://github.com/user/dotfiles` was not cloned yet, it will be cloned into `/home/user/DEV/dotfiles` and opened
  - if it is already cloned, it will just be opened
