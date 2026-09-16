# Builder Buy Boxes — Setup

Two pieces to set up in Google:

1. **Victory Formation Buy Boxes** — Google Sheet that stores every buy box.
2. **Log a Buy Box** — Google Form the dashboard POSTs to.

Plan ~15 minutes end to end. Send me back three things at the end:
- Sheet ID
- Form's `/formResponse` URL
- A pre-filled link so I can pull the `entry.NNN` IDs

---

## 1 · Create the Sheet

Log into Google as `gabe@victoryformationventures.com`.

- Go to [sheets.new](https://sheets.new)
- Rename to **Victory Formation Buy Boxes**
- Share → Anyone with the link → **Viewer**

---

## 2 · Create the Form

- Go to [forms.new](https://forms.new)
- Rename to **Log a Buy Box**
- Settings → Responses → **Link to Sheet** → pick **Victory Formation Buy Boxes**

Add these questions **in this exact order and with these exact lowercase labels**. All are Short answer unless noted. Only mark the ones flagged as required.

| # | Label | Type | Required |
|---|---|---|---|
| 1  | buy_box_id      | Short answer                 | ✅ |
| 2  | builder_name    | Short answer                 | ✅ |
| 3  | status          | Short answer                 | — |
| 4  | priority        | Short answer                 | — |
| 5  | city            | Short answer                 | ✅ |
| 6  | state           | Short answer                 | — |
| 7  | suburbs         | Paragraph                    | — |
| 8  | min_price       | Short answer (number)        | — |
| 9  | max_price       | Short answer (number)        | — |
| 10 | suburb_pricing  | Paragraph                    | — |
| 11 | min_lot_sqft    | Short answer (number)        | — |
| 12 | max_lot_sqft    | Short answer (number)        | — |
| 13 | min_frontage_ft | Short answer (number)        | — |
| 14 | max_frontage_ft | Short answer (number)        | — |
| 15 | min_depth_ft    | Short answer (number)        | — |
| 16 | max_depth_ft    | Short answer (number)        | — |
| 17 | must_haves      | Paragraph                    | — |
| 18 | deal_breakers   | Paragraph                    | — |
| 19 | notes           | Paragraph                    | — |
| 20 | logged_by       | Short answer                 | ✅ |

**Total: 20 questions.**

The Sheet auto-adds a Timestamp column at position 1 when the form is linked — nothing to do there.

> **How edit-in-place works:** every buy box has a stable `buy_box_id`. When an agent edits an existing buy box, the dashboard submits a NEW row with the SAME id. The parser keeps only the latest row per id, so the UI shows the current state. The sheet is append-only history — you can audit past values if you ever need to.

---

## 3 · Send me three things

1. **Sheet ID** — from the sheet URL. Looks like `1AbcDef…XYZ`.

2. **Form `/formResponse` URL** — open the form editor → click **Send** in the top-right → link icon → copy the viewform URL → change `/viewform` to `/formResponse` at the end.

3. **Pre-filled link with entry IDs** — in the form editor:
   - ⋮ menu (top-right) → **Get pre-filled link**
   - Type a **distinct throwaway value in every field** (e.g., `BB1`, `BUILDER1`, `Active`, `High`, `Austin`, `TX`, `SUBS1`, `100000`, `999999`, …). Distinct values are important — I match them back to fields by value.
   - Click **Get link** at the bottom → copy the URL and paste it back to me.

Once I have all three I'll fill `BUYBOX_CONFIG.SHEET_ID`, `FORM_URL`, and `FIELD_MAP` in `index.html` and the **+ Add Buy Box** button starts working immediately.

---

## What happens after wiring

**Land agents open** the dashboard → Land Acquisition → Buy Boxes.

**They see** every active buy box as a card: builder + city, price range, suburbs, lot/frontage/depth ranges, must-haves, deal-breakers, and who logged it. Filter by builder, city, or status; search across all text.

**Add a new buy box:**
- Click **+ Add Buy Box** — modal opens with a builder dropdown scoped to `Builders` and `Developers` from Development → Contacts
- If the builder or developer isn't in Contacts, the dropdown says "No builders or developers in Contacts" — agent has to go to **Development → Contacts** and add them first
- Fill in city, suburbs, pricing, dimensions, preferences → **Save Buy Box**

**Edit an existing buy box:**
- Click **Edit** on the card → modal pre-fills with current values → change anything → **Save Buy Box**
- Submits a new sheet row with the same `buy_box_id`, so the card updates in place.

**Status flow:** `Active → On Hold → Archived`. Archived rows still show on the list but greyed out; can be filtered out with the Status filter.
