# ERROU! Terminal Error Sound

<p align="center">
	<img src="media/images/errou.gif" alt="Faustao errou reaction" />
</p>


Faustão reage aos seus erros no terminal!

This extension plays Faustão's iconic "ERROU!" sound when a terminal command fails in VS Code.

## Features

- Faustão yells on terminal command failures (non-zero exit code)
- Works across Windows, macOS, and Linux
- Optional popup message for failed commands with configurable duration
- Configurable ignored exit codes
- Optional output-aware triggering for selected exit codes

## Requirements

- VS Code `1.110.0` or newer
- Audio output available on your machine
- Terminal shell integration enabled in VS Code (`Terminal > Integrated: Shell Integration: Enabled`)
- On Windows, shell integration is supported with PowerShell 7+ (`pwsh`) and Git Bash (legacy Windows PowerShell 5.1 is not supported)

Linux audio backends are tried in this order: `paplay`, `aplay`, `ffplay`.

## Extension Settings

This extension contributes the following settings:

- `faustaoErrou.showPopup` (boolean, default: `false`): Show a popup when a terminal command fails.
- `faustaoErrou.popupDuration` (number, default: `3000`): Duration in milliseconds for the popup notification.
- `faustaoErrou.ignoredExitCodes` (number[], default: `[130]`): Exit codes that should not trigger the sound.
- `faustaoErrou.onlyWhenOutputExistsExitCodes` (number[], default: `[]`): Exit codes that should only play the sound when the command produced terminal output. Useful to avoid playing the sound for commands that return non-zero exit codes on success (e.g. `grep` when it finds no matches).

Default rationale:
- `130`: Common code for Ctrl+C interruption, which is usually user cancellation.

Example configuration:

```json
{
	"faustaoErrou.showPopup": true,
	"faustaoErrou.popupDuration": 5000,
	"faustaoErrou.ignoredExitCodes": [130],
	"faustaoErrou.onlyWhenOutputExistsExitCodes": [1]
}
```

## License

MIT
