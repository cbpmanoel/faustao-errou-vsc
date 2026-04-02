# ERROU! Terminal Error Sound

<p align="center">
	<img src="media/images/errou.gif" alt="Faustao errou reaction" />
</p>


Faustão reage aos seus erros no terminal!

This extension plays Faustão's iconic "ERROU!" sound when a terminal command fails in VS Code.

## Features

- Faustão yells on terminal command failures (non-zero exit code)
- Works across Windows, macOS, and Linux
- Optional popup message for failed commands
- Configurable ignored exit codes

## Requirements

- VS Code `1.110.0` or newer
- Audio output available on your machine

Linux audio backends are tried in this order: `paplay`, `aplay`, `ffplay`.

## Extension Settings

This extension contributes the following settings:

- `faustaoErrou.showPopup` (boolean, default: `false`): Show a popup when a terminal command fails.
- `faustaoErrou.ignoredExitCodes` (number[], default: `[1, 130]`): Exit codes that should not trigger the sound.

Default rationale:
- `1`: Many CLI tools use this for expected outcomes in normal flows (for example, no match found or diff).
- `130`: Common code for Ctrl+C interruption, which is usually user cancellation.

Example configuration:

```json
{
	"faustaoErrou.showPopup": true,
	"faustaoErrou.ignoredExitCodes": [1, 130]
}
```

## License

MIT
