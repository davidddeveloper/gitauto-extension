import * as vscode from 'vscode';

interface Data {
    token: string;
}

function connect(context: vscode.ExtensionContext) {
    vscode.window.showInputBox({ prompt: 'Enter your email' }).then(email => {
        vscode.window.showInputBox({ prompt: 'Enter your password', password: true }).then(password => {
            if (email && password) {
                fetch('https://miniature-space-parakeet-q7q69q4q5jpqh6pq-8080.app.github.dev/gitauto/connect', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${btoa(email + ':' + password)}` }
                })
                .then(response => response.json() as Promise<Data>)
                .then(data => {
                    if (data.token) {
                        context.globalState.update('jwtToken', data.token);
                        vscode.window.showInformationMessage('Connected successfully!');
                    } else {
                        vscode.window.showErrorMessage('Connection failed', data.token);
                    }
                })
                .catch(() => {
                    vscode.window.showErrorMessage('Error connecting to server.');
                });
            }
        });
    });
}

module.exports = connect;