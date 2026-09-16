# Clients CRM — Setup

The Sales → **Clients** subtab renders a per-agent client book. Each teammate enters their own passcode → the workspace scopes to just their clients (table, stats, CSV export, Add Client modal). 24-hour unlock; "Switch agent" re-locks.

Three things to wire up:
1. **Victory Formation Clients** Google Sheet — where contact records live.
2. **Add Client** Google Form — what the modal POSTs to.
3. (Optional) **Open House master sheet ID** — auto-merge OH sign-ins.

Plus: each agent needs a `passcode` in the **Team Roster** sheet (see Section 6).

Plan ~20 minutes.

---

## 1 · Create the Sheet

1. [sheets.new](https://sheets.new) (logged in as `gabe@victoryformationventures.com`).
2. Rename: **Victory Formation Clients**
3. Share → Anyone with the link → Viewer

---

## 2 · Create the Form

1. [forms.new](https://forms.new)
2. Name it: **Add Client**
3. Add these questions in order (exact labels — lowercase, underscores):

   | # | Label | Type | Required |
   |---|---|---|---|
   | 1  | first_name        | Short answer | Yes |
   | 2  | last_name         | Short answer | Yes |
   | 3  | spouse            | Short answer | No |
   | 4  | status            | Dropdown: New / Nurture / Engaged / In Contract / Closed / Inactive | No |
   | 5  | cat_past          | Multiple choice: Yes / No | No |
   | 6  | cat_active        | Multiple choice: Yes / No | No |
   | 7  | cat_sphere        | Multiple choice: Yes / No | No |
   | 8  | cat_prospect      | Multiple choice: Yes / No | No |
   | 9  | cat_customrep     | Multiple choice: Yes / No | No |
   | 10 | email             | Short answer | No |
   | 11 | phone             | Short answer | No |
   | 12 | source            | Dropdown: Referral / Website / Open House / Social / Past Client / Sphere / Other | No |
   | 13 | address_line_1    | Short answer | No |
   | 14 | address_line_2    | Short answer | No |
   | 15 | city              | Short answer | No |
   | 16 | state             | Short answer | No |
   | 17 | zip               | Short answer | No |
   | 18 | neighborhood      | Short answer | No |
   | 19 | birthday          | Date | No |
   | 20 | closing_date      | Date | No |
   | 21 | last_touch        | Date | No |
   | 22 | next_action       | Short answer | No |
   | 23 | notes             | Paragraph | No |

4. **Settings → Responses → Link to Sheet → "Victory Formation Clients"**
5. Send → Link → Copy → change `/viewform` to `/formResponse` — that's `CLIENTS_CONFIG.FORM_URL`

---

## 3 · Get entry IDs

1. Form → ⋮ → "Get pre-filled link"
2. Fill placeholder values in every question
3. "Get link" → copy
4. Extract every `entry.NNN` and paste into `CLIENTS_CONFIG.FIELD_MAP` in `index.html`

---

## 4 · Optional — Wire Open House auto-merge

If you want Open House sign-ins to appear in the Clients list automatically (tagged "Open House Visitor", read-only):

1. Find your Open House master sheet ID (the per-agent sign-in sheet).
2. Paste it into `CLIENTS_CONFIG.OPEN_HOUSE_SHEET_ID`.

The merger looks for columns named **Full Name**, **Email**, **Phone**, and **Property Address**. Adjust the tab name via `OPEN_HOUSE_TAB` if it's not "Form Responses 1".

To skip OH auto-merge entirely, leave `OPEN_HOUSE_SHEET_ID` blank. You can still manually add notable OH visitors via the Add Client modal.

---

## 5 · Backfill existing contacts

A CSV of your existing 60 contacts (from the Numbers export you sent) is ready at:

```
Victory Formation Ventures/Client Write Ups/vfv-clients-import.csv
```

The columns match the new schema exactly. To backfill:

1. Open the **Victory Formation Clients** sheet.
2. Go to the **"Form Responses 1"** tab.
3. Open `vfv-clients-import.csv` in a text editor or Numbers/Excel.
4. Copy all rows (including the header row if the sheet is blank, or just data rows if headers are already there).
5. Paste into the sheet starting at row 2 (under the headers).

The mapping I applied to your existing data:
- **Past clients** → `cat_past = Yes`
- **Active clients** → `cat_active = Yes`
- **Sphere of influence** → `cat_sphere = Yes`
- Combined tags (e.g., "Active clients,Past clients") → both flags set
- Phone numbers normalized to `(XXX) XXX-XXXX` format
- Zip codes cleaned (no trailing `.0`)
- Title/Company merged into Notes

Refresh the dashboard after pasting → all 60 contacts appear in the Clients list with filtering by category/status.

---

---

## 6 · Per-agent passcodes (REQUIRED — without this, no one can see the Clients page)

The Clients page is locked behind an agent code. Each agent's code lives in the **Victory Formation Team Roster** sheet (the same one wired in `TEAM_CONFIG`).

### Add the column

1. Open the **Victory Formation Team Roster** sheet.
2. Add a new column header to the right of the existing columns: `passcode` (lowercase, exact spelling).
3. Fill in a 4-digit code for each agent. Suggestion: short, easy to remember, but not "1234" / "0000".
   - **Gabe's default:** `3034` (same as Commissions — feel free to change).

That's it for read-only access. Refresh the dashboard → enter your code → your client book appears.

### Optional: add to the Add Team Member form

Right now the Add Team Member modal does NOT post a passcode (the form question doesn't exist yet). To enable that flow:

1. Open the **Add Team Member** Google Form (the one wired in `TEAM_CONFIG.FORM_URL`).
2. Add a question: `passcode` · Short answer · not required.
3. Get the pre-filled link, extract the new `entry.NNN`, paste into `TEAM_CONFIG.FIELD_MAP.passcode` in `index.html`.
4. Update the Add Team Member modal markup to include a passcode input (`name="passcode"`).

Until that's done, when you onboard a new agent, also drop their code directly into the sheet's `passcode` column.

### Security disclaimer

This is a **UX scoping mechanism, not real authentication**. The Victory Formation Clients sheet is publicly readable because Google Sheets gviz requires it. Anyone with DevTools can bypass the lock. Use it to keep agents from accidentally browsing each other's books — don't rely on it for confidentiality of sensitive client info.

---

## How it behaves

- **Lock screen** → opening Clients prompts for a 4-digit agent code. Match against the Roster sheet → workspace unlocks scoped to that agent.
- **24-hour unlock** → won't re-prompt until the timer expires or you click "Switch agent".
- **Identity bar** → "Viewing as [Name] · Switch agent" sits at the top of the workspace so you always know whose book is on screen.
- **Add Client modal** → row appended to the sheet, agent field locked to the unlocked agent. Next reload picks it up.
- **Search box** → matches name / email / phone / city / neighborhood (scoped to current agent).
- **Category filter** → dropdown of: Past / Active / Sphere / Open House Visitor / Prospect / Custom Home Rep.
- **Status filter** → dropdown of: New / Nurture / Engaged / In Contract / Closed / Inactive.
- **Tile counts** → Total / Active / Past / OH Visitors all scoped to the current agent.
- **Export CSV** → downloads the currently-filtered (and agent-scoped) list. Click it after filtering to Active Clients → just those rows for Mailchimp.
- **Open House Visitors** show with a dashed pill and a left border accent to distinguish them from direct entries. They're read-only — edit at the source. OH visitors auto-scope by **Hosting Agent** column.

## Editing existing rows

Form only ADDS. To update a row's status, last_touch, etc., edit the row directly in the sheet. Next dashboard load reflects it.
