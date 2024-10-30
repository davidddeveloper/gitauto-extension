import * as vscode from 'vscode';

const repo = require('./getRepo');
const outputChannel = vscode.window.createOutputChannel('My Extension');
const setGitConfig = require('./helpers/setGitConfig');

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
    vscode.window.showErrorMessage(`status. ${status}`);
    outputChannel.appendLine('Repository: ' + repo.rootUri.toString());
    
    for (const change of status) {
        const fileUri = change.uri;
        const fileName = fileUri.fsPath;
    vscode.window.showErrorMessage(`fileUri. ${fileUri} --> ${fileName}`);

        // Get the diff for each specific file
        repo.diffWithHEAD(fileName).then((fileDiff: string) => {
            vscode.window.showErrorMessage(`fileDiff. ${fileDiff}`);
            fetch('https://miniature-space-parakeet-q7q69q4q5jpqh6pq-8080.app.github.dev/gitauto/generate-commit-msg', {
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
                    vscode.window.showInformationMessage('Commit message generated successfully!', data.message);

                    // TODO:
                    // 1. Copy commit message to clipboard
                    // 2. Git add filename
                    // 3. Git commit -m commit messageG
                    repo.add([fileName]).then(() => {
                        vscode.window.showInformationMessage('File added successfully!');
                        
                        setGitConfig('David', 'yHk9H@example.com');
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
        vscode.window.showInformationMessage('No changes in the working tree.');
    }
}

module.exports = generateCommit;