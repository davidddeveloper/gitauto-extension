import * as vscode from 'vscode';
const setGitConfig = require('./helpers/setGitConfig');
interface Data {
    token: string;
}

interface User {
    name: string;
    email: string;
}

function connect(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage("Hello World!")
    vscode.window.showInputBox({ prompt: 'Enter your email' }).then(email => {
        vscode.window.showInputBox({ prompt: 'Enter your password', password: true }).then(password => {
            if (email && password) {
                fetch('https://gitauto.davidconteh.engineer/connect', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${btoa(email + ':' + password)}` }
                })
                .then(response => response.json() as Promise<Data>)
                .then(data => {
                    if (data.token) {
                        context.globalState.update('jwtToken', data.token);
                        fetch('https://gitauto.davidconteh.engineer/users/me', {
                            method: 'GET',
                            headers: { 'Authorization': data.token }
                        })
                        .then(response => response.json() as Promise<User>)
                        .then(user => {
                            setGitConfig(user.name, email);
                        });
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