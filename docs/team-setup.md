# Team Roster — Setup

The **Team** panel in the Dashboard renders from a central Google Sheet ("Team Roster"). Adding a member through the modal POSTs to a Google Form, which writes a row in that Sheet, which the Dashboard fetches on every page load. The Offer Instructions Generator (and any future tool with an agent picker) reads the same Sheet, so adding a teammate once propagates everywhere.

Until you set this up the Dashboard falls back to a baked-in roster (Gabe + Partner) so nothing breaks.

This doc walks you through the one-time setup. Plan ~15 minutes.

## Overview

Three things to wire up:

1. **Team Roster Sheet** — where the data lives.
2. **Add Team Member Google Form** — what the modal POSTs to.
3. **`TEAM_CONFIG` in `index.html`** — IDs that connect the dashboard to the sheet + form. Mirror the same Sheet ID into `offer-instructions.html`.

The pattern is identical to the Commissions Tracker, Open House Sign-Ins, and Land Acquisition Intake — if any of those work today, this will too.

---

## 1 · Create the Team Roster Sheet

1. Go to [sheets.new](https://sheets.new) logged in as `gvjbusiness@yahoo.com`.
2. Rename the file: **Victory Formation Team Roster**.
3. Rename the first tab: **Roster** (exact spelling — the loader is case-insensitive but the tab name needs to match `SHEET_TAB` in `TEAM_CONFIG`).
4. Paste this header row into row 1:

   ```
   Timestamp | name | title | role | active | email | phone | photo | license | div_sales | div_land | div_customrep | div_development
   ```

   Each label goes in its own column (A through M). Lowercase + underscores matter — the loader matches column names exactly.

5. Share the Sheet: **Share → General access → Anyone with the link → Viewer**. This is required for the dashboard's anonymous `gviz` fetch to work. (The Sheet is not linked from anywhere public; only the admins know the URL.)
6. Grab the Sheet ID from the URL — the long string between `/d/` and `/edit`:

   ```
   https://docs.google.com/spreadsheets/d/AAAAAAAAAAAA/edit
                                          ^^^^^^^^^^^^
                                          this is the ID
   ```

   Save it — you'll paste it into `TEAM_CONFIG.SHEET_ID` in step 3.

---

## 2 · Create the Add Team Member Google Form

1. Go to [forms.new](https://forms.new) logged in as the same admin account.
2. Name it **Add Team Member** (untitled section text doesn't matter — only the question labels do).
3. Add these questions in order. Use exactly these question labels (lowercase, underscores) — the form's "entry.NNN" keys map by position once you grab them.

   | # | Question label | Type | Required? |
   |---|---|---|---|
   | 1 | name | Short answer | Yes |
   | 2 | title | Short answer | No |
   | 3 | role | Multiple choice (Founder / Agent / Specialist / Admin) | Yes |
   | 4 | active | Multiple choice (Yes / No) | No |
   | 5 | email | Short answer | Yes |
   | 6 | phone | Short answer | Yes |
   | 7 | photo | Short answer | No |
   | 8 | license | Short answer | No |
   | 9 | div_sales | Multiple choice (Yes / No) | No |
   | 10 | div_land | Multiple choice (Yes / No) | No |
   | 11 | div_customrep | Multiple choice (Yes / No) | No |
   | 12 | div_development | Multiple choice (Yes / No) | No |

4. **Settings → Responses → Link to Sheet → Select existing spreadsheet → "Victory Formation Team Roster" → Roster tab.** This wires form submissions to the Sheet.
5. **Send → Link → Copy.** This is the "viewer" link. We need the *submit* URL instead.
6. Convert the URL: replace the trailing `/viewform` with `/formResponse`. That's `TEAM_CONFIG.FORM_URL`.

### Grab the entry IDs

Each Form question has a hidden `entry.NNNNNNN` key. To discover them:

1. Open the Form's **Send → Link → "Pre-filled link"** mode (or `…/viewform`).
2. Click each question and type a placeholder value (`__name__`, `__title__`, etc.).
3. Click **Get link**. The resulting URL looks like:

   ```
   https://docs.google.com/forms/d/e/.../viewform?entry.1234567890=__name__&entry.2345678901=__title__&…
   ```

4. Pull the `entry.NNNNNNN` value for each placeholder and map it into `TEAM_CONFIG.FIELD_MAP` in `index.html`:

   ```js
   FIELD_MAP: {
     name:            "entry.1234567890",
     title:           "entry.2345678901",
     role:            "entry.…",
     active:          "entry.…",
     email:           "entry.…",
     phone:           "entry.…",
     photo:           "entry.…",
     license:         "entry.…",
     div_sales:       "entry.…",
     div_land:        "entry.…",
     div_customrep:   "entry.…",
     div_development: "entry.…"
   }
   ```

This is the same procedure that wired the Commissions form; see `index.html` around the Commission `FIELD_MAP` for reference.

---

## 3 · Wire the IDs into the dashboard

Open `index.html` and find the `TEAM_CONFIG` block near the bottom of the file (search for `TEAM ROSTER`). Replace the empty strings:

```js
const TEAM_CONFIG = {
  SHEET_ID:  "AAAAAAAAAAAA",       // from step 1
  SHEET_TAB: "Roster",
  FORM_URL:  "https://docs.google.com/forms/d/e/.../formResponse",  // from step 2
  FIELD_MAP: { /* entry.NNN values from step 2 */ }
};
```

Also open `offer-instructions.html` and paste the same `SHEET_ID` into its `TEAM_CONFIG.SHEET_ID`. The Offer Instructions tool only reads from the Sheet (it doesn't add to it), so it just needs the Sheet ID + tab name.

Commit + push to `main`. GitHub Pages will pick up the change within a minute.

---

## 4 · Backfill existing members

Add Gabe and Partner directly in the Sheet (or use the **Add Team Member** modal on the live dashboard to test the form flow):

| name | title | role | active | email | phone | photo | license | div_sales | div_land | div_customrep | div_development |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Gabe Jeudy-Lally | Founder & Principal | Founder | Yes | gvjbusiness@yahoo.com | (737) 600-5101 | | | Yes | Yes | Yes | Yes |
| Partner Hibbett | Land Acquisition Specialist | Specialist | Yes | | | | | No | Yes | No | No |

Hard-refresh the dashboard. The Team panel should now show "Synced from Team Roster sheet" in its meta line instead of "Showing built-in fallback".

---

## How it flows from there

- The Dashboard fetches the Roster sheet on every page load. New members appear within a refresh.
- The "+ Add Team Member" card on the Team panel opens the modal. Submitting POSTs to the Form, which writes a row in the Sheet.
- The new member's card shows immediately (optimistic UI) so you don't wait for the round-trip; the next page load re-syncs from the Sheet.
- The Offer Instructions Generator fetches the same Sheet on load. Picking a different agent in the dropdown auto-fills the document with their license #, email, and phone.

## Editing or deleting members

The Form only adds. To edit a member's contact info or deactivate someone, edit the row directly in the Sheet. Set the `active` column to `No` to hide them from the dashboard and agent pickers without losing the record.

If a member needs to disappear entirely (e.g. wrong row entered): delete the row in the Sheet. They'll be gone on next page load.
