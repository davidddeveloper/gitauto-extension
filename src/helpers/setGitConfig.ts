const { exec } = require('child_process');
import * as vscode from 'vscode';

function setGitConfig(username: string, email: string) {

    
    exec(`git config --global user.name "${username}"`, (error: Error) => {
        if (error) {
            vscode.window.showErrorMessage(`Failed to set user name: ${error.message}`);
            return;
        }

        exec(`git config --global user.email "${email}"`, (error: Error) => {
            if (error) {
                vscode.window.showErrorMessage(`Failed to set user email: ${error.message}`);
                return;
            }

            vscode.window.showInformationMessage('Git user name and email configured successfully!');
        });
    });
}

module.exports = setGitConfig;