import * as vscode from 'vscode';

interface User {
    email: string;
}

function authenticate(token: string): void {
    // Call your /users/me route to validate token
    fetch('https://gitauto.davidconteh.engineer/users/me', {
        method: 'GET',
        headers: { 'Authorization': token }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Invalid response');
        }
        return response.json() as Promise<User>;
    })
    .then(user => {
        if (user) {
            vscode.window.showInformationMessage(`Welcome back, ${user.email}!`);
        }
    })
    .catch(() => {
        vscode.window.showErrorMessage('Invalid session. Please log in again.');
    });
    vscode.window.showInformationMessage(`Welcome back, David!`);
}

module.exports = authenticate;