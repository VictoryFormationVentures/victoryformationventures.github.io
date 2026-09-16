# Tenant Move-In Report — Setup

Two pieces to set up in Google:

1. **Victory Formation Move-In Reports** — Google Sheet that receives every submitted report.
2. **Tenant Move-In Report** — Google Form the tenant-facing page POSTs to.

Plan ~20 minutes end to end. Send me back three things at the end:
- The sheet ID
- The form's `/formResponse` URL
- A pre-filled link so I can pull the `entry.NNN` IDs

---

## 1 · Create the Sheet

Log into Google as `gvjbusiness@yahoo.com`.

- Go to [sheets.new](https://sheets.new)
- Rename to **Victory Formation Move-In Reports**
- Share → Anyone with the link → **Viewer**

### Turn on email notifications (so you know the second a tenant submits)

- Inside the sheet: **Tools → Notification settings → Edit notifications**
- New rule: **Any changes are made** → **Email — right away**
- Save. Google will email `gvjbusiness@yahoo.com` every time a new row is added.

---

## 2 · Create the Form

- Go to [forms.new](https://forms.new)
- Rename to **Tenant Move-In Report**
- Settings → Responses → **Collect email addresses = Off** (we ask for it as a regular field so the tenant doesn't need to sign in to Google)
- Settings → Responses → **Link to Sheet** → pick **Victory Formation Move-In Reports** you just made

Add these questions **in this exact order and with these exact lowercase labels**. All are Short answer unless noted. Only mark the ones flagged as required.

### Property & Tenant

| # | Label | Type | Required |
|---|---|---|---|
| 1  | property_address       | Short answer | ✅ |
| 2  | unit                   | Short answer | — |
| 3  | inspection_date        | Short answer | ✅ |
| 4  | tenant_name            | Short answer | ✅ |
| 5  | tenant_email           | Short answer | ✅ |
| 6  | tenant_phone           | Short answer | — |
| 7  | lease_start            | Short answer | — |

### Rooms — Condition + Notes (18 rooms × 2 fields = 36)

| # | Label | Type |
|---|---|---|
| 8  | entry_condition        | Short answer |
| 9  | entry_notes            | Paragraph |
| 10 | living_condition       | Short answer |
| 11 | living_notes           | Paragraph |
| 12 | dining_condition       | Short answer |
| 13 | dining_notes           | Paragraph |
| 14 | kitchen_condition      | Short answer |
| 15 | kitchen_notes          | Paragraph |
| 16 | appliances_condition   | Short answer |
| 17 | appliances_notes       | Paragraph |
| 18 | master_br_condition    | Short answer |
| 19 | master_br_notes        | Paragraph |
| 20 | bedroom2_condition     | Short answer |
| 21 | bedroom2_notes         | Paragraph |
| 22 | bedroom3_condition     | Short answer |
| 23 | bedroom3_notes         | Paragraph |
| 24 | bedroom4_condition     | Short answer |
| 25 | bedroom4_notes         | Paragraph |
| 26 | bedroom5_condition     | Short answer |
| 27 | bedroom5_notes         | Paragraph |
| 28 | master_bath_condition  | Short answer |
| 29 | master_bath_notes      | Paragraph |
| 30 | bath2_condition        | Short answer |
| 31 | bath2_notes            | Paragraph |
| 32 | bath3_condition        | Short answer |
| 33 | bath3_notes            | Paragraph |
| 34 | bath4_condition        | Short answer |
| 35 | bath4_notes            | Paragraph |
| 36 | bath5_condition        | Short answer |
| 37 | bath5_notes            | Paragraph |
| 38 | laundry_condition      | Short answer |
| 39 | laundry_notes          | Paragraph |
| 40 | garage_condition       | Short answer |
| 41 | garage_notes           | Paragraph |
| 42 | exterior_condition     | Short answer |
| 43 | exterior_notes         | Paragraph |

### Safety, Keys, Photos, Notes

| # | Label | Type | Required |
|---|---|---|---|
| 44 | detectors_status  | Short answer | ✅ |
| 45 | detectors_notes   | Paragraph | — |
| 46 | keys_count        | Short answer | ✅ |
| 47 | alarm_code        | Short answer | — |
| 48 | photo_link        | Short answer | — |
| 49 | overall_notes     | Paragraph | — |

### Signature

| # | Label | Type | Required |
|---|---|---|---|
| 50 | signature_name    | Short answer | ✅ |
| 51 | signature_date    | Short answer | ✅ |

**Total: 51 questions.** Copy/paste the labels from this doc — use ⋯ → **Duplicate** on the first question of each type (Short answer / Paragraph) to speed it up.

> **Tip:** Speed hack — after adding the first "Short answer" question, use the ⋯ menu → **Duplicate** to clone it, then just change the label. Do the same for the paragraph type.

---

## 3 · Send me three things

1. **Sheet ID** — from the sheet URL. Looks like `1AbcDef…XYZ`.

2. **Form `/formResponse` URL** — open the form editor → click **Send** in the top-right → link icon → copy the viewform URL → change `/viewform` to `/formResponse` at the end.

3. **Pre-filled link with entry IDs** — in the form editor:
   - ⋮ menu (top-right) → **Get pre-filled link**
   - Type a **distinct throwaway value in every field** (e.g. `PROP1`, `UNIT1`, `2026-01-01`, `TENANT1`, …, and for the room conditions type `G1`, `G2`, `G3` etc.). Distinct values are important — I match them back to fields by value.
   - Click **Get link** at the bottom → copy the URL and paste it back to me.

Once I have all three I'll fill `CONFIG.FORM_URL` and `CONFIG.FIELD_MAP` in `move-in-report.html`, and the form starts submitting real reports immediately.

---

## What happens after wiring

**Send a tenant the link.** From the dashboard: `Property Management → Files → Tenant Move-In Report` — copy the link. Or generate a per-tenant pre-filled link that already contains the property address, unit, and tenant name using URL params:

```
https://gvj32.github.io/Dashboard/move-in-report.html?property=1234+Main+St&unit=A&tenant=Jane+Doe&email=jane@example.com&start=2026-08-01
```

**Tenant opens the link on their phone**, fills in each room's condition + notes, and hits Submit.

**You get an email** the moment the row lands in the sheet.

**Photos** — tenant can either paste a link to an iCloud/Google Photos/Dropbox album, or use the "📷 Text photos to manager" button which opens an SMS to your phone with the property address pre-populated.

**Move-out** — for now, hand the tenant the printable PDF (`Property Condition Report`) at move-out and compare against the sheet record from move-in. Later we can build a move-out form that pulls the tenant's original move-in report side-by-side.
