# AGENTS.md — pi-sm

Project-specific guidance for AI agents working in this repo.

## What this is

A [pi](https://pi.dev) package bundling two extensions for lite session management:

| File            | Command   | Purpose                                                       |
| --------------- | --------- | ------------------------------------------------------------ |
| `src/index.ts`  | `/sm`     | Full-screen TUI: browse, search, rename, fork, hide, delete sessions. |
| `src/rename.ts` | `/rn`   | Quick inline rename (`/rn [name]`, or `/rn` to edit).              |

Sister modules (`config`, `constants`, `types`, `tree`, `render`, `dialogs`) support `index.ts`.

## Repo layout

```
src/            extension source (loaded directly by pi — no build step)
screenshots/    README/gallery images (.gitkeep'd; add later)
package.json    pi manifest + peerDependencies + npm metadata
```

## Runtime model — no build step

Pi loads `src/*.ts` directly via [jiti](https://github.com/unjs/jiti). TypeScript is **not compiled**.

- Keep the existing `./foo.ts` **explicit-extension** import style. Do not add a compile/build step.
- Edits take effect after reloading extensions (see Dev loop). Do not assume a `dist/`.
- `tsc` is **not** the source of truth for correctness (see Known issues). Runtime behavior inside pi is.

## Dependencies

| Import source                        | Where it goes                          |
| ------------------------------------ | -------------------------------------- |
| `@earendil-works/pi-coding-agent`, `@earendil-works/pi-tui`, `typebox` | `peerDependencies` (`"*"` range). **Never bundle** — pi provides these. |
| Any other runtime npm package        | `dependencies` (pi runs `npm install` on package install). |
| Node built-ins (`node:fs`, etc.)     | No declaration needed.                 |

Adding a new pi-core import → add it to `peerDependencies`, not `dependencies`.

## Dev loop & verification

There is **no automated test suite**. Verify manually in the pi TUI.

```fish
# try once for the current session (temp install, no settings change)
pi -e /home/well/Code/pi-sm

# install persistently (writes to pi settings)
pi install git:github.com/well1791/pi-sm
```

- `/reload` hot-reloads only extensions in auto-discovered dirs (`~/.pi/agent/extensions/`, `.pi/extensions/`). **Installed packages are not hot-reloaded** — reinstall to pick up changes.
- For fast iteration, symlink the repo (or just `src/`) into `~/.pi/agent/extensions/` and use `/reload`.
- After changes, exercise both `/sm` and `/rn`.

## Known issues (pre-existing in source)

The verbatim source has `tsc` errors against pi's type definitions. They are **runtime-safe under jiti** and were intentionally left as-is to ship the proven source:

- `src/index.ts` — `matchesKey(data, "pageup" | <string>)`: 2nd param typed `KeyId`; string literals aren't members. Type-strictness only.
- `src/dialogs.ts` — `ctx.ui.custom<…>()` generic arg, and a `SessionManager` private-constructor constraint. Type-level only.
- `src/rename.ts:36` — `.filter()` on `message.content: string | Array<…>` without narrowing. **Genuine latent bug**: throws if `content` is ever a plain string (pi sends arrays in practice). Worth narrowing regardless.

If you reintroduce a `typecheck` script + `tsconfig.json`, fix these first. Don't "fix" runtime-working code by accident — confirm a change actually improves runtime behavior.

## Config

The `/sm` extension reads optional user config from `~/.pi/agent/pi-sm.json` (path hardcoded in `src/config.ts` via `process.env.HOME`):

- `commands` — override slash-command names (see `src/constants.ts` `DEFAULT_COMMANDS`); default `rename` → `rn`. Takes effect on extension reload.
- `shortcuts` — override action keys (see `src/constants.ts` `DEFAULT_SHORTCUTS`).
- `colors` — hex (`"#RRGGBB"`) or ANSI 256 (e.g. `"242"`); keys in `DEFAULT_COLORS`.

Unspecified keys keep defaults. See `README.md` for the full table.

## Publishing

- Remote: `git@github.com:well1791/pi-sm.git`, branch `main`.
- Installable by users via `pi install git:github.com/well1791/pi-sm`.
- `npm publish` also works (package.json is complete: `files` ships only `src/`, `README.md`, `LICENSE`). `screenshots/` and dev tooling stay out of the tarball.

## Conventions

- Shell commands shown to the user use **fish** syntax.
- `screenshots/` is tracked via `.gitkeep`; commit real images there when available.
