# Change Log

All notable changes to the "faustao-errou" extension will be documented in this file.

## [1.0.2] - 2026-04-02

### Changed
- Documented terminal shell integration requirements in the README.
- Clarified that Windows shell integration requires PowerShell 7+ (`pwsh`) or Git Bash.
- Removed exit code `1` from the default ignored exit codes list, keeping only `130`.

## [1.0.1] - 2026-04-02

### Fixed
- Corrected extension icon path to `media/images/icon.png` so VSIX packaging works reliably.

### Changed
- Improved packaging metadata in `package.json` with `homepage` and `bugs` links.

## [1.0.0] - 2026-04-02

### Added
- Initial public release
- Plays "ERROU!" sound when terminal commands fail
- Cross-platform audio playback support (Windows, macOS, Linux)
- Configurable popup notification (`faustaoErrou.showPopup`)
- Configurable ignored exit codes (`faustaoErrou.ignoredExitCodes`, default: `[1, 130]`)