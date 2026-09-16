# Development Contacts — Setup

The top-level **Contacts** tab renders the relationship book across 9 categories: Realtors, Builders, Developers, General Contractors, Inspectors, Investors, Appraisers, Lenders, Council Members. Each category gets its own subtab, but they all read from one shared sheet.

The entire Contacts section is gated behind a single passcode (Gabe's `5555`, Vincent's `7777`, or admin `0000`). Unlock once and all 9 categories open. 24-hour persistence in localStorage.

Plan ~15 minutes.

---

## 1 · Create the Sheet

1. [sheets.new](https://sheets.new) (logged in as `gabe@victoryformationventures.com`).
2. Rename: **VFV Contacts**
3. Share → Anyone with the link → Viewer

---

## 2 · Create the Form

1. [forms.new](https://forms.new)
2. Name it: **Add VFV Contact**
3. Add these questions in order (exact lowercase labels):

   | # | Label | Type | Required |
   |---|---|---|---|
   | 1  | category     | Dropdown: Realtors / Builders / Developers / General Contractors / Inspectors / Investors / Appraisers / Lenders / Council Members | Yes |
   | 2  | name         | Short answer | Yes |
   | 3  | company      | Short answer | No |
   | 4  | role         | Short answer | No |
   | 5  | email        | Short answer | No |
   | 6  | phone        | Short answer | No |
   | 7  | address      | Short answer | No |
   | 8  | specialties  | Short answer | No |
   | 9  | last_touch   | Date | No |
   | 10 | next_action  | Short answer | No |
   | 11 | notes        | Paragraph | No |

4. **Settings → Responses → Link to Sheet → "VFV Contacts"**
5. Send → Link → copy → change `/viewform` to `/formResponse` — that's `CONTACTS_CONFIG.FORM_URL`

---

## 3 · Get entry IDs

1. Form → ⋮ → "Get pre-filled link"
2. Fill placeholder values in every question
3. "Get link" → copy
4. Extract every `entry.NNN` and paste into `CONTACTS_CONFIG.FIELD_MAP` in `index.html`:

```js
const CONTACTS_CONFIG = {
  SHEET_ID:  "…",
  SHEET_TAB: "Form Responses 1",
  FORM_URL:  "https://docs.google.com/forms/d/e/…/formResponse",
  FIELD_MAP: {
    category:    "entry.…",
    name:        "entry.…",
    company:     "entry.…",
    role:        "entry.…",
    email:       "entry.…",
    phone:       "entry.…",
    address:     "entry.…",
    specialties: "entry.…",
    last_touch:  "entry.…",
    next_action: "entry.…",
    notes:       "entry.…"
  }
};
```

---

## 4 · Commit + push

Once `SHEET_ID`, `FORM_URL`, and all 11 entry IDs are filled in, commit and push. GitHub Pages picks up within a minute.

---

## 5 · The passcode

The lock screen accepts whatever is in Gabe Jeudy-Lally's `passcode` column in the **Victory Formation Team Roster** sheet. If that column is empty, it falls back to `3034` (so the section is usable from day one).

To change the passcode: edit Gabe's row in Team Roster → `passcode` cell → save. The dashboard picks it up next refresh.

To open access to another teammate: give them the same code. (The lock is a single shared code — not per-agent like Clients.)

### Security disclaimer

Same caveat as the rest of the dashboard's locks: this is a UX gate, not real auth. The Development Contacts sheet is publicly readable (gviz requires it). Anyone with DevTools can bypass the screen. Use the gate to keep casual viewers from browsing investor / partner relationships — don't rely on it for confidentiality.

---

## How it behaves

- **8 subtabs** in the Development side-nav under "Contacts". Click any to enter that category's page.
- **One sheet** holds all 8 categories — the `category` column slots each row into its bucket. Edit the sheet directly to move a contact between categories.
- **Per-category search box** — type to filter just that category's table.
- **"+ Add" button** opens a single modal pre-set to the current category. Switch the category dropdown if you're filing a contact elsewhere.
- **Export CSV** downloads just the current category's filtered list.
- **Lock & 24-hour unlock** — first time you open any Contacts subtab, the lock screen appears. After unlock, all 8 categories open. "Switch agent" doesn't apply here — the only way to re-lock is to clear browser storage or wait 24 hours.

## Editing existing rows

The form only ADDS. To update a contact's `role`, `phone`, `last_touch`, etc., edit the row directly in the sheet. Next dashboard load reflects it.

To move a contact between categories, edit their `category` cell — they'll appear under the new subtab on next load.
