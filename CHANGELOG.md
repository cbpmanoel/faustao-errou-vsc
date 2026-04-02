# Change Log

All notable changes to the "faustao-errou" extension will be documented in this file.

## [1.1.0] - 2026-04-02

### Added
- New configuration `faustaoErrou.popupDuration` to control notification display time in milliseconds when popups are enabled.
- Custom notification rendering for popup messages to support configurable durations.
- New configuration `faustaoErrou.onlyWhenOutputExistsExitCodes` to only play the sound for specific exit codes when the command produced terminal output. Useful to avoid false positives for commands that return non-zero exit codes on success (e.g. `grep` when no matches found).

### Changed
- Improved audio command path handling by escaping file paths across platforms.

### Fixed
- Updated sound playback error handling to use explicit `Error | null` typing for safer logging.
- Corrected extension source indentation and formatting for readability and consistency.

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