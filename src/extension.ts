import * as vscode from 'vscode';
import { exec } from 'child_process';


export function activate(context: vscode.ExtensionContext) {
    console.log('ERROU! extension activated');
	const soundPath = context.asAbsolutePath('media/sounds/faustao-errou.wav');
	const disposable = vscode.window.onDidEndTerminalShellExecution(event => {
        if (event.exitCode !== undefined) {
            const config = vscode.workspace.getConfiguration('faustaoErrou');
            const ignoredExitCodes = getIgnoredExitCodes(config);

            if (!isTerminalFailure(event.exitCode, ignoredExitCodes)) {
                return;
            }

			playSound(soundPath);

            if (config.get('showPopup')) {
				vscode.window.showErrorMessage('A terminal command failed with exit code ' + event.exitCode + '.');
			}
		}
	});

	context.subscriptions.push(disposable);
}

function getIgnoredExitCodes(config: vscode.WorkspaceConfiguration) {
    const configuredCodes = config.get<number[]>('ignoredExitCodes', [130]);
    return configuredCodes.filter(code => Number.isInteger(code));
}

function isTerminalFailure(exitCode: number, ignoredExitCodes: number[]) {
    return exitCode !== 0 && !ignoredExitCodes.includes(exitCode);
}

function playSound(filePath: string) {
    let command = '';
    if (process.platform === 'win32') {
        command = `powershell -c (New-Object Media.SoundPlayer "${filePath}").PlaySync()`;
    } else if (process.platform === 'darwin') {
        command = `afplay "${filePath}"`;
    } else {
        command = `paplay "${filePath}" 2>/dev/null || aplay "${filePath}" 2>/dev/null || ffplay -nodisp -autoexit "${filePath}" 2>/dev/null || true`;
    }

    exec(command, (err: any) => {
        if (err && !err.message.includes('not found')) {
            console.error('Failed to play sound', err);
        }
    });
}

export function deactivate() {}
