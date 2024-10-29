import * as vscode from 'vscode';

function getRepo() {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    if (!gitExtension) {
        vscode.window.showErrorMessage('Git extension is not available.');
        return;
    }

    const api = gitExtension.getAPI(1);
    const repo = api.repositories[0]; // Assuming the first repository
    if (!repo) {
        vscode.window.showErrorMessage('No Git repository found.');
        return;
    }

    return repo;

}

module.exports = getRepo();