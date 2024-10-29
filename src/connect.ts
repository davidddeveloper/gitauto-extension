import * as vscode from 'vscode';

interface Data {
    token: string;
}

function connect(context: vscode.ExtensionContext) {
    vscode.window.showInputBox({ prompt: 'Enter your email' }).then(email => {
        vscode.window.showInputBox({ prompt: 'Enter your password', password: true }).then(password => {
            if (email && password) {
                fetch('https://my-server.com/connect', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })
                .then(response => response.json() as Promise<Data>)
                .then(data => {
                    if (data.token) {
                        context.globalState.update('jwtToken', data.token);
                        vscode.window.showInformationMessage('Connected successfully!');
                    } else {
                        vscode.window.showErrorMessage('Connection failed');
                    }
                })
                .catch(() => {
                    vscode.window.showErrorMessage('Error connecting to server.');
                });

                context.globalState.update('jwtToken', email+password);
                vscode.window.showInformationMessage('Connected successfully!')
            }
        });
    });
}

module.exports = connect