# GitHub Setup

The site lives in the `VictoryFormationVentures/victoryformationventures.github.io` repository and is served by GitHub Pages from the `main` branch at:

```
https://victoryformationventures.github.io/
```

The repo is public because GitHub Pages on the Free plan only serves public repos. That means anyone with the URL can view the dashboard and read its source, but not push changes. Keep passcodes as a convenience gate, not a security boundary, and never commit Apps Script URLs that accept writes without a shared secret.

## Day-to-day editing

The simplest workflow is GitHub Desktop:

1. Install GitHub Desktop and sign in as `VictoryFormationVentures` organization (owned by your gvj32 account).
2. File > Clone repository > pick `VictoryFormationVentures/victoryformationventures.github.io`.
3. Edit files in any editor, then in GitHub Desktop write a summary, click Commit to main, then Push origin.
4. The live site updates within a minute or two.

You can also edit a single file directly on github.com (open the file, click the pencil icon, commit).

## If Pages ever gets turned off

Repo Settings > Pages > Source: Deploy from a branch > Branch: `main`, folder `/ (root)` > Save.
