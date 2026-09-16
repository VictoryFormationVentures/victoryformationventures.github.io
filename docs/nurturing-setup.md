# Nurturing Clients — Setup

The Custom Home Rep → **Pipeline** subtab renders a "Nurturing · Prospects" section above the Active Projects list. Prospects are tracked through 5 stages — Inquiry, Discovery Call, Proposal Sent, Negotiating, Signed — with `Signed` and `Lost` automatically hidden so the list stays clean.

Data lives in a Google Sheet driven by a Google Form (same pattern as Buyer Deals, Listings, Team Roster). Until wired, the section shows "Setup pending" and the modal opens but warns submissions won't persist.

Plan ~15 minutes.

---

## 1 · Create the Sheet

1. [sheets.new](https://sheets.new) (logged in as `gvjbusiness@yahoo.com`).
2. Rename to: **Victory Formation Nurturing Clients**
3. Share → Anyone with the link → Viewer

---

## 2 · Create the Form

1. [forms.new](https://forms.new)
2. Name it: **Log a Nurturing Client**
3. Add these questions in order — **exact labels**:

   | # | Label | Type | Required |
   |---|---|---|---|
   | 1 | agent | Short answer | Yes |
   | 2 | client | Short answer | Yes |
   | 3 | stage | Dropdown: Inquiry / Discovery Call / Proposal Sent / Negotiating / Signed / Lost | Yes |
   | 4 | source | Dropdown: Referral / Website / Social / Broker / Past Client / Other | No |
   | 5 | property_address | Short answer | No |
   | 6 | budget_range | Short answer | No |
   | 7 | target_location | Short answer | No |
   | 8 | last_touch | Date | No |
   | 9 | next_action | Short answer | No |
   | 10 | notes | Paragraph | No |

4. **Settings → Responses → Link to Sheet → "Victory Formation Nurturing Clients"**
5. Send → Link → copy → change `/viewform` to `/formResponse` — that's `NURTURING_CONFIG.FORM_URL`

---

## 3 · Get entry IDs

1. Form → ⋮ → "Get pre-filled link"
2. Fill placeholder values in all 10 questions
3. "Get link" → copy
4. Extract every `entry.NNN` and paste into `NURTURING_CONFIG.FIELD_MAP` in `index.html`:

```js
const NURTURING_CONFIG = {
  SHEET_ID:  "...",       // from Sheet URL
  SHEET_TAB: "Form Responses 1",
  FORM_URL:  "https://docs.google.com/forms/d/e/.../formResponse",
  FIELD_MAP: {
    agent:            "entry.…",
    client:           "entry.…",
    stage:            "entry.…",
    source:           "entry.…",
    property_address: "entry.…",
    budget_range:     "entry.…",
    target_location:  "entry.…",
    last_touch:       "entry.…",
    next_action:      "entry.…",
    notes:            "entry.…"
  }
};
```

---

## 4 · Commit + push

Once `SHEET_ID`, `FORM_URL`, and all 10 entry IDs are filled in, commit and push. GitHub Pages picks up within a minute.

---

## How it behaves

- Prospects show as cards sorted by stage progression (Inquiry → Negotiating), then by oldest last-touch first.
- Cards highlight in amber if the last touch is more than 14 days old ("X days since last touch" badge).
- When you set a prospect's stage to **Signed**, they drop out of the Nurturing list. Use the "Log a New Project" action below to promote them into the Active Pipeline with full project fields.
- **Lost** entries also drop out — kept in the sheet for historical record, hidden from the active view.

## Editing prospects

The form only ADDS. To update a prospect's stage, last_touch, or next_action: open the sheet and edit the row directly. Next dashboard load picks it up.
