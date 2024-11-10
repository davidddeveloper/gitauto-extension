// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const authenticate = require('./authenticate');
const connect = require('./connect');
const generateCommit = require('./generateCommit');
const gitPush = require('./push');
const gitautoAll = require('./gitautoAll');
const setGitConfig = require('./helpers/setGitConfig');
interface User {
    username: string;
    email: string;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("gitauto extension activated!");
	vscode.window.registerUriHandler({
		handleUri(uri: vscode.Uri) {
		  const token = uri.query.split('=')[1]; // Extract token from the query
		  vscode.window.showInformationMessage('this is the token', token);
		  if (token) {
			// Store the token securely using VSCode's secret storage API
			context.globalState.update('jwtToken', token);
			fetch('https://gitauto.davidconteh.engineer/users/me', {
				method: 'GET',
				headers: { 'x-token': token }
			})
			.then(response => response.json() as Promise<User>)
			.then(user => {
				setGitConfig(user.username, user.email);
				vscode.window.showInformationMessage(`Welcome back, ${user.username}!`);
			});
		  } else {
			vscode.window.showWarningMessage('No token found in the URI.');
		  }
		}
	  });

	const jwtToken = context.globalState.get('jwtToken');

	if (jwtToken) {
		authenticate(jwtToken);
	}

	let login = vscode.commands.registerCommand('gitauto.connect', () => {
		connect(context);
	});

	let generateCommitCommand = vscode.commands.registerCommand('gitauto.generateCommit', () => {
		generateCommit(context);
	});

	let pushCommand = vscode.commands.registerCommand('gitauto.gitPush', () => {
		generateCommit(context);
		gitPush(context);
	});

	//let gitautoAll = vscode.commands.registerCommand('gitauto.gitauto', () => {
	//	gitautoAll(context);
	//})

	context.subscriptions.push(login);
	context.subscriptions.push(generateCommitCommand);
	context.subscriptions.push(pushCommand);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gitauto" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('gitauto.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from gitauto!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
