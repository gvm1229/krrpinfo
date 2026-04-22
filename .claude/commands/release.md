# release

Bump the project to the next minor version and publish a release tag.

Run the steps **in order**, skipping any that have nothing to do.

## Step 1: Determine the target version

1. Read the current `version` field from `package.json`.
2. Compute the target version:
   - If the current patch is **not 0** (e.g., `0.1.7`) → bump to the next minor with patch reset (`0.2.0`).
   - If the current patch is **already 0** (e.g., `0.2.0`) → keep the current version. No bump needed; just tag and push if the tag doesn't already exist.
3. Verify the tag does not already exist remotely:
   ```bash
   git fetch --tags
   git rev-parse "v<target>" 2>/dev/null && echo "Tag exists — abort"
   ```
   If the tag already exists, stop and report — never overwrite an existing release tag.

## Step 2: Confirm the current branch is `release`

1. Run `git branch --show-current`. If not on `release`, abort and report.
2. Run `git status --porcelain`. If the working tree has unstaged changes unrelated to a version bump, abort and tell the user to commit/stash first. Untracked files are OK.
3. Run `git fetch origin release && git status -uno` to ensure local `release` is in sync with remote (no diverged commits).

## Step 3: Bump version (only if Step 1 said to bump)

1. Update `package.json` `version` to the target version.
2. Add a release marker daily-log entry: `docs/logs/YYYYMMDD-release-v<target>.md`
   - Top of file format:

     ```markdown
     # <YYYY-MM-DD> — release v<target>

     > version: <target>

     ## release: minor 버전 release

     - <1–3 highlight bullets summarizing the patches since the last release>
     ```

   - Do **not** duplicate every patch entry — the patch entries already exist as previous daily logs.

3. Stage and commit:
   ```bash
   git add package.json docs/logs/YYYYMMDD-release-v<target>.md
   git commit -m "🔖 release: v<target>"
   ```
4. Push the commit: `git push origin release`.

## Step 4: Create and push the release tag

1. Create an **annotated** tag pointing at the current `HEAD`:
   ```bash
   git tag -a "v<target>" -m "Release v<target>"
   ```
2. Push the tag: `git push origin "v<target>"`.

## Step 5: Verify (if release workflow exists)

1. If `.github/workflows/release.yml` exists, wait briefly then check `gh run list --workflow=release.yml --limit 1` to confirm the workflow started.
2. Once it finishes (or if no workflow), confirm the release exists with `gh release view "v<target>"` (only if `gh` GitHub Release was created).
3. Report any release URL to the user.

## Output

Report:

- Previous version → target version (or "already on release version, no bump")
- Tag pushed
- Workflow run status (if applicable)
- Release URL (if applicable)

$ARGUMENTS
