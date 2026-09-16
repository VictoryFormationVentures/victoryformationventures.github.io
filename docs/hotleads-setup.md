# Land Acquisition · Hot Leads — Setup

Two pieces to set up in Google:

1. **Victory Formation Hot Leads** — Google Sheet.
2. **Log a Hot Lead** — Google Form the dashboard POSTs to.

Plan ~10 minutes. Send me three things at the end:
- Sheet ID
- Form's `/formResponse` URL
- A pre-filled link with all fields so I can extract the entry IDs

---

## 1 · Create the Sheet

Log into Google as `gvjbusiness@yahoo.com`.

- Go to [sheets.new](https://sheets.new)
- Rename to **Victory Formation Hot Leads**
- Share → Anyone with the link → **Viewer**

---

## 2 · Create the Form

- Go to [forms.new](https://forms.new)
- Rename to **Log a Hot Lead**
- Settings → Responses → **Link to Sheet** → pick **Victory Formation Hot Leads**

Add these **16 questions** in this exact order and with these exact lowercase labels:

| # | Label | Type | Required |
|---|---|---|---|
| 1  | lead_id           | Short answer                 | ✅ |
| 2  | property_address  | Short answer                 | ✅ |
| 3  | neighborhood      | Short answer                 | — |
| 4  | estimated_value   | Short answer                 | — |
| 5  | owner_name        | Short answer                 | — |
| 6  | owner_phone       | Short answer                 | — |
| 7  | owner_email       | Short answer                 | — |
| 8  | source            | Short answer                 | — |
| 9  | referred_by       | Short answer                 | — |
| 10 | heat_level        | Short answer                 | ✅ |
| 11 | status            | Short answer                 | ✅ |
| 12 | land_agent        | Short answer                 | ✅ |
| 13 | last_touch        | Short answer                 | — |
| 14 | next_action_date  | Short answer                 | — |
| 15 | next_action       | Short answer                 | — |
| 16 | notes             | Paragraph                    | — |

Sheet auto-adds Timestamp at column 1.

> **How edit-in-place works:** every hot lead has a stable `lead_id`. When you edit one, the dashboard submits a NEW row with the SAME id. The parser keeps only the latest row per id, so the card shows the current state. The sheet is append-only history — you can audit past values if you ever need to.

---

## 3 · Send me three things

1. **Sheet ID** — from the sheet URL. Long string between `/d/` and `/edit`.
2. **Form `/formResponse` URL** — form editor → **Send** → link icon → copy the URL. I'll swap `/viewform` for `/formResponse`.
3. **Pre-filled link with entry IDs** — form editor → ⋮ menu → **Get pre-filled link**. Fill each field with a distinct value (`LID1`, `PROP1`, `NEIGH1`, etc.) → **Get link** → copy → paste back to me.

Once I have all three I'll fill `HOTLEAD_CONFIG.SHEET_ID`, `FORM_URL`, and `FIELD_MAP` and Hot Leads goes live.

---

## What happens after wiring

- **+ Add Hot Lead** button opens the modal → save → new sheet row.
- **Cards** render with property, owner contact, source, heat pill (Hot/Warm/Cool), status, last touch date, next action, notes.
- **Stale warning** appears when Last Touch was more than 14 days ago.
- **Edit** on any card opens the modal pre-filled → save → new row with the same `lead_id`, latest wins → card updates.
- **Filters** by agent, heat level, status; search across property/owner/notes.
- **Auto-sort**: Hot > Warm > Cool, then most recently touched first.
