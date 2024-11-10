import * as vscode from 'vscode';

const repo = require('./getRepo');

// Log messages using the output channel

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
    //vscode.window.showErrorMessage(`Please log in first. ${repo}`);
    const status = repo.state.workingTreeChanges;
    
    for (const change of status) {
        const fileUri = change.uri;
        const fileName = fileUri.fsPath;

        // Get the diff for each specific file
        repo.diffWithHEAD(fileName).then((fileDiff: string) => {
            //vscode.window.showInformationMessage(`fileDiff: ${fileDiff}`);
            fetch('https://gitauto.davidconteh.engineer/generate-commit-msg', {
                method: 'POST',
                headers: { 
                    'X-Token': `${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ git_status : change.status, git_diff: fileDiff })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Invalid response.');
                }
                return response.json() as Promise<Data>;
            })
            .then(data => {
                if (data.message) {
                    vscode.window.showInformationMessage(`Commit message generated successfully!`, 'Copy').then(selection => {
                        if (selection === 'Copy') {
                            // Copy the message to clipboard
                            vscode.env.clipboard.writeText(data.message);
                            vscode.window.showInformationMessage('Commit message copied to clipboard!');
                        }
                    });
                    repo.add([fileName]).then(() => {
                        vscode.window.showInformationMessage('File added successfully!');

                        return repo.commit(data.message).then(() => {
                            vscode.window.showInformationMessage('Commit created successfully!');
                        }).catch((error: Error) => {
                            vscode.window.showErrorMessage('Failed to create commit.', error.message);
                        });
                    })
                    .catch((error: Error) => {
                        vscode.window.showErrorMessage('Failed to add file.', error.message);
                    });
                } else {
                    vscode.window.showErrorMessage('Failed to generate commit message.', data.message);
                }
            })
            .catch((error: Error) => {
                vscode.window.showErrorMessage('Error connecting to server.', error.message);
            });
        });

    } 
    if (status.length === 0) {
        vscode.window.showInformationMessage('No changes in the working tree. Working tree clean.');
    }
}

module.exports = generateCommit;