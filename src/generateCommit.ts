import * as vscode from 'vscode';

const repo = require('./getRepo');

interface Data {
    message: string;
}

interface GitChange {
    uri: vscode.Uri;
    status: string;
}

function generateCommit(context: vscode.ExtensionContext) {
    const token = context.globalState.get('jwtToken');

    if (!token) {
        vscode.window.showErrorMessage('Please log in first.');
        return;
    }

    // Fetch the git status and diff (example shown, but you can fetch it based on your extension setup)
    vscode.window.showErrorMessage(`Please log in first. ${repo}`);
    const status = repo.state.workingTreeChanges;

    for (const change of status) {
        const fileUri = change.uri;
        const filename = fileUri.fsPath;

        // Get the diff for each specific file
        const fileDiff = repo.getWorkingTreeDiff(fileUri);
        

        fetch('https://my-server.com/generate-commit', {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ gitStatus : change.status, fileDiff })
        })
        .then(response => response.json() as Promise<Data>)
        .then(data => {
            if (data.message) {
                vscode.window.showInformationMessage(`Generated Commit Message: ${data.message}`);
            } else {
                vscode.window.showErrorMessage('Failed to generate commit message.');
            }
        })
        .catch(() => {
            vscode.window.showErrorMessage('Error connecting to server.');
        });
    }
}

module.exports = generateCommit;