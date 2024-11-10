const { exec } = require('child_process');
import * as vscode from 'vscode';

const repo = require('./getRepo');
const outputChannel = vscode.window.createOutputChannel('My Extension');

// Log messages using the output channel

interface Data {
    message: string;
}

interface GitChange {
    uri: vscode.Uri;
    status: string;
}

function gitPush(context: vscode.ExtensionContext) {
    const token = context.globalState.get('jwtToken');

    if (!token) {
        vscode.window.showErrorMessage('Please log in first.');
        return;
    }

    repo.push().then(() => {
        vscode.window.showInformationMessage('Pushed successfully!');
    })
    .catch(() => {
        vscode.window.showErrorMessage('Error pushing to server.');
    });
}

module.exports = gitPush;