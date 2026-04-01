# ship

Commit the current unstaged changes following these rules strictly:

1. **No Co-Authored-By**: Never include a Co-Authored-By line in the commit message.

2. **Commit message format**: Read the last two commits by the user (not by another collaborator, Claude or any bot) via `git log` and match their style exactly. Commit messages must be prefixed with a gitmoji emoji as declared in `commitlint.config.js` (which extends the `gitmoji` convention). Typically the format is:

   ```
   <emoji> <type>(<scope>): <Korean description> (<version>)
   ```

   Where `<emoji>` is a gitmoji (e.g. ✨, 🐛, ♻️, ⬆️) and `<type>` is `feat`, `fix`, `refactor`, etc.

3. **Version bump**: Increment the patch version in `package.json` to match the commit message version only IF there are any code changes. If the commit is purely about docs or deleting files, then the version change must not occur. If the git unstaged changes already includes a `package.json` with its version updated, then the version change must not occur.

4. **Update PR.md**: If the current branch is anything other than the `main` branch, add a concise entry to `PR.md` describing what changed. Match the existing section style.

5. **Update CHANGES.md**: Add a concise entry to `CHANGES.md` describing what changed. Match the existing section style.

6. **Commit only, do NOT push**: Stage relevant files, commit, and stop. Do not run `git push` unless explicitly prompted by the user.

7. **Run tests**: If there are any code changes, verify tests pass before committing. If they fail, fix or report. If the commit is purely about docs or deleting files, then the test must not be done.

$ARGUMENTS
