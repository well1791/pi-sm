/**
 * Session rename extension.
 *
 * /rn [name] - set name directly
 * /rn        - prompt with current name pre-filled for editing
 *
 * The command name defaults to `rn` and is overridable via the `commands.rename`
 * key in ~/.pi/agent/pi-sm.json (requires an extension reload to take effect).
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { loadConfig } from "./config.ts";
import { DEFAULT_COMMANDS } from "./constants.ts";

export default function (pi: ExtensionAPI) {
	// Command name is read at load time; changing it requires an extension reload.
	const cfg = loadConfig((msg) => console.error(`pi-sm: ${msg}`));
	const renameCommand =
		typeof cfg.commands.rename === "string" && cfg.commands.rename.trim()
			? cfg.commands.rename.trim()
			: DEFAULT_COMMANDS.rename;

	async function promptRename(ctx: ExtensionContext) {
		if (!ctx.hasUI) {
			ctx.ui.notify("rename requires interactive mode", "error");
			return;
		}

		// Get current name or derive from first user message
		let currentName = pi.getSessionName() ?? "";
		if (!currentName) {
			const branch = ctx.sessionManager.getBranch();
			for (const entry of branch) {
				if (entry.type === "message" && "role" in entry.message && entry.message.role === "user") {
					const text = entry.message.content
						.filter((c): c is { type: "text"; text: string } => c.type === "text")
						.map((c) => c.text)
						.join(" ");
					if (text) {
						currentName = text.slice(0, 70);
						break;
					}
				}
			}
		}

		if (!currentName) {
			ctx.ui.notify("Nothing to name — no user messages found", "info");
			return;
		}

		const newName = await ctx.ui.editor("Rename session:", currentName);
		if (newName?.trim()) {
			pi.setSessionName(newName.trim());
			ctx.ui.notify(`Session named: ${newName.trim()}`, "info");
		}
	}

	pi.registerCommand(renameCommand, {
		description: "Rename session (usage: /rn [name], or /rn to edit current name)",
		handler: async (args, ctx) => {
			const trimmed = args.trim();

			if (trimmed) {
				pi.setSessionName(trimmed);
				ctx.ui.notify(`Session named: ${trimmed}`, "info");
				return;
			}

			await promptRename(ctx);
		},
	});

	// pi.registerShortcut("alt+n", {
	// 	description: "Rename session",
	// 	handler: async (ctx) => {
	// 		await promptRename(ctx);
	// 	},
	// });
}
