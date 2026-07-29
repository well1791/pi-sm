// semantic-release configuration.
// Drives version bumps, CHANGELOG.md, npm publishing, and GitHub Releases from
// Conventional Commits. Runs in CI on every push to `main` (see
// .github/workflows/release.yml). Never bump `version` or edit CHANGELOG.md by
// hand — semantic-release owns both.
export default {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
};
