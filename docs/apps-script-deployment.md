# Apps Script — Deploy the Commission Form Backend

The Sales tab's **Submit Commission** modal posts to a Google Apps Script Web App, which appends the deal to the `Deal Log` tab of the Sales Commission Tracker. The script itself already exists at:

```
/Sales Division/Apps Script - Code.gs
```

…you just need to install it on the Google Sheet and deploy it as a Web App. Five minutes total.

## Step 1 — Open the Apps Script editor

1. Open the Sales Commission Tracker in Google Sheets.
2. Top menu: **Extensions → Apps Script**. A new tab opens with the script editor.

## Step 2 — Paste in the code

1. In the editor, you'll see a default `Code.gs` file with an empty `myFunction()`. Select all and delete it.
2. Open `/Sales Division/Apps Script - Code.gs` on your Mac, copy the full contents, paste into the editor.
3. Click the disk icon (or `⌘ S`) to save.

> The script's `SHEET_ID` constant at the top already points at your sheet (`1iKZFR0wr3Gho_FrF3n5zBU4OWBIDQHtWSK6q2MeMj7w`). No edits needed.

## Step 3 — Deploy as a Web App

1. Top-right of the editor, click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** `Commission form endpoint`
   - **Execute as:** `Me (gvjbusiness@yahoo.com)`
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. Google will ask you to **Authorize access** the first time. Sign in as `gvjbusiness@yahoo.com`, click through the "unsafe app" warning ("Advanced" → "Go to … (unsafe)"). That warning appears because it's your own unverified script — fine.
6. Copy the **Web app URL** it shows you. It looks like:

```
https://script.google.com/macros/s/AKfycb…long-token…/exec
```

That's the URL the dashboard needs.

## Step 4 — Paste the URL into the dashboard

1. Open `Company/Dashboard/index.html` in any editor.
2. Search for `APPS_SCRIPT_URL`. You'll find this near the bottom:

   ```js
   const APPS_SCRIPT_URL = ""; // <-- paste your Apps Script /exec URL here
   ```

3. Replace the empty string with your `/exec` URL:

   ```js
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb…/exec";
   ```

4. Save the file.

## Step 5 — Test it

1. Double-click `Company/Dashboard/index.html` to open it.
2. You should land on the Sales tab. Click **Submit Commission**.
3. Fill in the form with a test deal and submit. You should see "Submitted. Deal logged to the Commission Tracker."
4. Open the Google Sheet → **Deal Log** tab. The test row should be there.

If submission fails:
- "Form is not connected" → `APPS_SCRIPT_URL` is still empty. Re-check step 4.
- "Server error: …" → the script ran but threw. Most common cause: the script's `SHEET_ID` doesn't match the sheet you deployed it from, or the `Deal Log` tab was renamed.
- "Network error: …" → the deployment isn't reachable. Re-check that step 3's "Who has access" is set to **Anyone**.

## Updating the script later

If you change the code (e.g., add a field), don't create a **New deployment** — that gives you a new URL and would require updating the dashboard. Instead:

1. Save changes in the script editor.
2. **Deploy → Manage deployments**.
3. Click the pencil icon on the existing deployment.
4. Set **Version: New version** and click **Deploy**.

This keeps the same URL.

## Push the URL to GitHub?

The `/exec` URL is technically a secret-ish thing — anyone with it can write to your Deal Log. The repo is **private** so it's fine to commit alongside `index.html`. If you ever flip the repo to public, move the URL to an untracked `config.local.js` file (`.gitignore` already excludes it).
