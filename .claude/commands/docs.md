# docs

Update project documentation to reflect recent code changes. Run the following steps **in order**, skipping any step that has nothing to do.

## Step 1: Add or update today's daily log

1. Run `git log --oneline -20` and `git diff HEAD~5 --stat` to identify recent changes not yet documented.
2. List existing log files: `ls docs/logs/` to find the latest documented date.
3. If there are undocumented commits since that date, add a new log file (or append to today's existing one):
   - Path: `docs/logs/YYYYMMDD-{title}.md` (kebab-case Korean/English title, e.g. `20260415-redeem-flow-cleanup.md`)
   - Top of file format:

     ```markdown
     # <YYYY-MM-DD> — <one-line summary>

     > version: <0.x.y> (if bumped this day)

     ## ✨ feat

     - ...

     ## 🐛 fix

     - ...

     ## 📝 docs

     - ...
     ```

   - Group by commit type (use the same emoji+type used in commit messages).
   - List concerns/files with brief Korean descriptions.

4. If today's log is already up to date, say so and move on.

**Convention**: `docs/logs/` is the **source of truth** for change history (one file per day). The root `CHANGES.md` does not exist — historical entries live under `docs/logs/`.

## Step 2: Update PR.md (non-main, non-release branches only)

1. Check the current branch with `git branch --show-current`.
2. If the branch is `main` or `release`, skip this step entirely.
3. Otherwise, run `git log release..HEAD --oneline` and `git diff release...HEAD --stat` to see all branch changes.
4. Update `PR.md` in the project root with:
   - **Title section**: `# PR: <branch-name> branch`
   - **Per-feature sections**: `## <emoji> <Korean title>` with concise bullet summary (what changed, why)
   - Group entries by feature/concern
5. Match the tone and format of the existing `PR.md`.

## Step 3: Update AGENTS.md project structure

1. Run `git diff HEAD~5 --stat` (or `git diff release...HEAD --stat` if on a non-main branch) to identify structural changes.
2. Read the `## Project Structure` section of `AGENTS.md`.
3. Only update if there are **structural** changes such as:
   - New components, pages, or lib modules added or removed
   - New directories created
   - Convention changes (new patterns, renamed concepts, removed systems)
   - Stack changes (new dependencies, framework upgrades)
4. Do NOT update for:
   - Bug fixes within existing files
   - Content changes (copy, translations)
   - Minor refactors that don't change the file tree or conventions
5. If updating, make **surgical edits** — touch only the lines that changed. Keep descriptions brief ("which is where", not full details).
6. If no structural changes exist, say so and move on.

## Output

After all steps, report a brief summary of what was updated (or that everything was already current).

$ARGUMENTS
