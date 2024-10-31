// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const authenticate = require('./authenticate');
const connect = require('./connect');
const generateCommit = require('./generateCommit');
const gitPush = require('./push');
const gitautoAll = require('./gitautoAll');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

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

	let push = vscode.commands.registerCommand('gitauto.push', () => {
		generateCommit(context);
		gitPush(context);
	});

	//let gitautoAll = vscode.commands.registerCommand('gitauto.gitauto', () => {
	//	gitautoAll(context);
	//})

	context.subscriptions.push(login);
	context.subscriptions.push(generateCommitCommand);
	context.subscriptions.push(gitPush);
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
