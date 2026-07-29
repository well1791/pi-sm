# Changelog

All notable changes to this project are documented in this file.

The format is based on [Conventional Commits](https://conventionalcommits.org),
and releases are produced automatically by
[semantic-release](https://github.com/semantic-release/semantic-release). Do not
edit this file by hand — entries from `0.2.0` onward are generated from commit
messages on each release.

## [0.1.0](https://github.com/well1791/pi-sm/releases/tag/v0.1.0) - 2026-07-29

Initial release of `pi-sm` — a lite session-manager package for the
[pi](https://pi.dev) coding agent.

### Features

- **sm:** full-screen TUI to browse, search, rename, fork, hide, and delete
  sessions (`/sm` command).
- **rename:** quick inline session rename (`/rn` command; `/rn [name]` to rename
  directly, `/rn` to edit).
- **sm:** `PageUp`/`PageDown` navigation in the fork-tree picker.
