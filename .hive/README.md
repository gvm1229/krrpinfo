# Aigent Hive installed harness

Files under this `.hive/` directory and exact Aigent Hive marker blocks generated into shared files are licensed under Apache License 2.0. The license text is stored in `.hive/LICENSE-AIGENT-HIVE.txt`.

This license applies only to Aigent Hive-provided material. It does not change the license of the consumer project's own source, documentation, configuration, or data.

Collaborators do not need to install Hive for ordinary development. Follow the availability
gate in `.agents/directives/00-project-harness.md` before the command-backed procedures below.
Without local Hive activation, keep common project rules and use existing development tools;
do not claim Hive coordination or knowledge updates. An existing protection failure is not
permission to bypass it. Installation, global setup, and other tools' settings remain personal.

Canonical project knowledge lives under `.hive/knowledge/`. Markdown and YAML are
tracked source; `.hive/index/hive.sqlite3` is disposable and can be rebuilt with:

```text
hive index rebuild --target . --output json
hive knowledge query --target . --text "<terms>" --output json
hive knowledge lint --target . --output json
```

Hive-aware automated edits coordinate only their own exact project paths through the ignored
`.hive/runtime/active-sessions/` directory. Before an automated edit, follow
`.agents/directives/03-session-coordination.md` and use `hive session`; direct user or editor
writes remain outside that best-effort boundary.

Do not edit an existing Raw revision. Ingest a changed source as a new
content-addressed revision. Deleted prose is not copied into `suppression.yml`.
