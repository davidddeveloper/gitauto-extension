const { exec } = require('child_process');
import * as vscode from 'vscode';

function setGitConfig(username: string, email: string) {

    exec(`git config --global user.name`, (error: Error, stdout: string, stderr: string) => {
        if (error || stderr) {
            console.error(`Error retrieving Git username: ${error || stderr}`);
            return;
        }
    
        // Check if the username is already set
        const username = stdout.trim();
        // check if the email already exist
        exec(`git config --global user.email`, (error: Error, stdout: string, stderr: string) => {
            if (error || stderr) {
                console.error(`Error retrieving Git email: ${error || stderr}`);
                return;
            }
    
            // Check if the email is already set
            const email = stdout.trim();
    
            if (username && email) {
                vscode.window.showInformationMessage('Git user name and email already configured!');
                return;
            }
    
            // Set the username and email
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
        });
    });
    
}

module.exports = setGitConfig;