import * as vscode from 'vscode';
import { exec } from 'child_process';


export function activate(context: vscode.ExtensionContext) {
    console.log('ERROU! extension activated');
	const soundPath = context.asAbsolutePath('media/sounds/faustao-errou.wav');
    const executionHadOutput = new Map<vscode.TerminalShellExecution, boolean>();

    const startDisposable = vscode.window.onDidStartTerminalShellExecution(event => {
        executionHadOutput.set(event.execution, false);
        void trackExecutionOutput(event.execution, executionHadOutput);
    });

    const endDisposable = vscode.window.onDidEndTerminalShellExecution(event => {
        if (event.exitCode !== undefined) {
            const config = vscode.workspace.getConfiguration('faustaoErrou');
            const ignoredExitCodes = getIgnoredExitCodes(config);
            const onlyWhenOutputExistsExitCodes = getOnlyWhenOutputExistsExitCodes(config);
            const hadOutput = executionHadOutput.get(event.execution) ?? false;
            executionHadOutput.delete(event.execution);

            if (!isTerminalFailure(event.exitCode, ignoredExitCodes)) {
                return;
            }

            if (shouldRequireOutput(event.exitCode, onlyWhenOutputExistsExitCodes) && !hadOutput) {
                return;
            }

			playSound(soundPath);

            if (config.get('showPopup')) {
                const duration = config.get<number>('popupDuration', 3000);
                showNotification(`ERROU! Exit code: ${event.exitCode}`, duration);
			}
		}
	});

    context.subscriptions.push(startDisposable, endDisposable);
}

function getIgnoredExitCodes(config: vscode.WorkspaceConfiguration) {
    const configuredCodes = config.get<number[]>('ignoredExitCodes', [130]);
    return configuredCodes.filter(code => Number.isInteger(code));
}

function getOnlyWhenOutputExistsExitCodes(config: vscode.WorkspaceConfiguration) {
    const configuredCodes = config.get<number[]>('onlyWhenOutputExistsExitCodes', []);
    return configuredCodes.filter(code => Number.isInteger(code));
}

function isTerminalFailure(exitCode: number, ignoredExitCodes: number[]) {
    return exitCode !== 0 && !ignoredExitCodes.includes(exitCode);
}

function shouldRequireOutput(exitCode: number, onlyWhenOutputExistsExitCodes: number[]) {
    return onlyWhenOutputExistsExitCodes.includes(exitCode);
}

async function trackExecutionOutput(
    execution: vscode.TerminalShellExecution,
    executionHadOutput: Map<vscode.TerminalShellExecution, boolean>
) {
    try {
        for await (const chunk of execution.read()) {
            if (hasVisibleUnicodeOutput(chunk)) {
                executionHadOutput.set(execution, true);
                return;
            }
        }
    } catch {
        // Fallback to exit-code-only behavior since some terminals may not support reading output
    }
}

function hasVisibleUnicodeOutput(outputChunk: string) {
    // Check if there's any non-whitespace Unicode text remaining after stripping ANSI codes, OSC sequences, and control characters
    const withoutAnsi = outputChunk.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
    const withoutOsc = withoutAnsi.replace(/\x1B\][^\x07]*(\x07|\x1B\\)/g, '');
    const withoutControls = withoutOsc.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    return /\S/.test(withoutControls);
}

function playSound(filePath: string) {
    let command = '';
    if (process.platform === 'win32') {
        const escapedPath = filePath.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        command = `powershell -c (New-Object Media.SoundPlayer "${escapedPath}").PlaySync()`;
    } else if (process.platform === 'darwin') {
        const escapedPath = filePath.replace(/"/g, '\\"');
        command = `afplay "${escapedPath}"`;
    } else {
        const escapedPath = filePath.replace(/"/g, '\\"');
        command = `paplay "${escapedPath}" 2>/dev/null || aplay "${escapedPath}" 2>/dev/null || ffplay -nodisp -autoexit "${escapedPath}" 2>/dev/null || true`;
    }

    exec(command, (err: any) => {
        if (err && !err.message.includes('not found')) {
            console.error('Failed to play sound', err);
        }
    });
}

function showNotification(message: string, duration: number) {
    // Workaround to show a notification for a custom duration since VSCode's API doesn't support it natively
    // Source: https://stackoverflow.com/a/78415993
    vscode.window.withProgress(
        { location: vscode.ProgressLocation.Notification },
        async (progress) => {
            const steps = 100;
            const delay = duration / steps;

            for (let i = 0; i <= steps; i++) {
                await new Promise<void>((resolve) => {
                    setTimeout(() => {
                        progress.report({ increment: 1, message: message });
                        resolve();
                    }, delay);
                });
            }
        }
    );
}

export function deactivate() {}
