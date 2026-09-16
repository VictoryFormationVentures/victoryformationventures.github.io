# Active Deals — Setup

The Sales → **Active Deals** subtab renders two pipelines from two Google Sheets:

1. **Victory Formation Buyer Deals** — buyer-rep deals under contract with milestone tracking.
2. **Victory Formation Listings** — sell-side listings with their current stage.

Each pipeline has a logging modal that POSTs to a Google Form, which writes a row in its sheet, which the dashboard reads via `gviz` JSON on every page load. Same pattern as the Land Acquisition pipeline, Commissions Tracker, and Team Roster.

Until you wire them up, both sections show **"Setup pending"** and the modals warn that submissions won't persist. Once `BUYERDEAL_CONFIG` and `LISTING_CONFIG` are populated in `index.html`, everything lights up.

Plan ~25 minutes for both sheets + forms.

---

## Pipeline 1 · Victory Formation Buyer Deals

### 1A. Create the Sheet

1. Go to [sheets.new](https://sheets.new) logged in as `gabe@victoryformationventures.com`.
2. Name it **Victory Formation Buyer Deals**.
3. The default tab `"Sheet1"` stays for now — the Form will create a `"Form Responses 1"` tab when you link it in step 1C.
4. **Share** → General access → **Anyone with the link → Viewer**. The dashboard's gviz read is anonymous; this is required.

### 1B. Create the Form

1. Go to [forms.new](https://forms.new) (same admin account).
2. Name it **Log a Buyer-Side Deal**.
3. Add these questions in order. Use **exactly these labels** (lowercase, underscores) so the dashboard reader picks them up by name:

   | # | Label | Type | Required |
   |---|---|---|---|
   | 1  | agent                 | Short answer | Yes |
   | 2  | client                | Short answer | Yes |
   | 3  | property_address      | Short answer | Yes |
   | 4  | listing_agent         | Short answer | No |
   | 5  | listing_brokerage     | Short answer | No |
   | 6  | contract_price        | Short answer | Yes |
   | 7  | earnest_money         | Short answer | No |
   | 8  | date_under_contract   | Date | Yes |
   | 9  | dd_end                | Date | No |
   | 10 | inspection_date       | Date | No |
   | 11 | appraisal_date        | Date | No |
   | 12 | financing_contingency | Date | No |
   | 13 | closing_date          | Date | No |
   | 14 | stage                 | Dropdown: Under Contract / Due Diligence / Inspections / Appraisal / Financing / Cleared to Close / Closed / Killed | Yes |
   | 15 | notes                 | Paragraph | No |

4. **Settings → Responses → Link to Sheet → "Victory Formation Buyer Deals"**. This creates the `"Form Responses 1"` tab.
5. **Send → Link → Copy**. Convert the `/viewform` ending to `/formResponse` — that's `BUYERDEAL_CONFIG.FORM_URL`.

### 1C. Get the entry IDs

Same procedure as Team Roster:

1. Form → ⋮ → **"Get pre-filled link"**.
2. Type placeholder values into every question (e.g. `__agent__`, `__client__`, etc.).
3. Click **"Get link"** → **"Copy link"**.
4. The URL contains `entry.NNNNNNN=__agent__&entry.MMMMMMM=__client__&…`. Extract every `entry.NNN` and paste them into `BUYERDEAL_CONFIG.FIELD_MAP` in `index.html`:

```js
const BUYERDEAL_CONFIG = {
  SHEET_ID:  "...",   // from the sheet URL
  SHEET_TAB: "Form Responses 1",
  FORM_URL:  "https://docs.google.com/forms/d/e/.../formResponse",
  FIELD_MAP: {
    agent:                 "entry.…",
    client:                "entry.…",
    property_address:      "entry.…",
    listing_agent:         "entry.…",
    listing_brokerage:     "entry.…",
    contract_price:        "entry.…",
    earnest_money:         "entry.…",
    date_under_contract:   "entry.…",
    dd_end:                "entry.…",
    inspection_date:       "entry.…",
    appraisal_date:        "entry.…",
    financing_contingency: "entry.…",
    closing_date:          "entry.…",
    stage:                 "entry.…",
    notes:                 "entry.…"
  }
};
```

---

## Pipeline 2 · Victory Formation Listings

### 2A. Create the Sheet

1. New Sheet → name it **Victory Formation Listings**.
2. Share with Anyone with the link → Viewer.

### 2B. Create the Form

1. New Form → name it **Log a Listing**.
2. Add these questions in order:

   | # | Label | Type | Required |
   |---|---|---|---|
   | 1  | agent               | Short answer | Yes |
   | 2  | seller              | Short answer | Yes |
   | 3  | property_address    | Short answer | Yes |
   | 4  | list_price          | Short answer | Yes |
   | 5  | list_date           | Date | Yes |
   | 6  | stage               | Dropdown: Coming Soon / Active / Showing / Pending / Under Contract / Closed / Withdrawn / Expired | Yes |
   | 7  | date_under_contract | Date | No |
   | 8  | closing_date        | Date | No |
   | 9  | sold_price          | Short answer | No |
   | 10 | buyer_agent         | Short answer | No |
   | 11 | notes               | Paragraph | No |

3. **Settings → Responses → Link to Sheet → "Victory Formation Listings"**.
4. Copy `/viewform` URL, change to `/formResponse` — that's `LISTING_CONFIG.FORM_URL`.
5. Get pre-filled link → extract every `entry.NNN` → paste into `LISTING_CONFIG.FIELD_MAP`:

```js
const LISTING_CONFIG = {
  SHEET_ID:  "...",
  SHEET_TAB: "Form Responses 1",
  FORM_URL:  "https://docs.google.com/forms/d/e/.../formResponse",
  FIELD_MAP: {
    agent:                "entry.…",
    seller:               "entry.…",
    property_address:     "entry.…",
    list_price:           "entry.…",
    list_date:            "entry.…",
    stage:                "entry.…",
    date_under_contract:  "entry.…",
    closing_date:         "entry.…",
    sold_price:           "entry.…",
    buyer_agent:          "entry.…",
    notes:                "entry.…"
  }
};
```

---

## 3 · Commit + push

Once both `BUYERDEAL_CONFIG` and `LISTING_CONFIG` are filled in, commit `index.html` and push. GitHub Pages picks up the change within a minute. Hard-refresh the dashboard.

You should now see:
- "Log a Buyer-Side Deal" / "Log a Listing" buttons working — submissions land in their sheets.
- Each pipeline section renders cards from its sheet's data on every page load.

---

## How stages route

**Buyer Side pipeline shows:** every row whose stage is NOT `Closed` or `Killed`. So `Under Contract`, `Due Diligence`, `Inspections`, `Appraisal`, `Financing`, `Cleared to Close` all appear. Sorted by closing date (next-up first).

**Listings pipeline shows:** every row whose stage is NOT `Closed`, `Withdrawn`, or `Expired`. So `Coming Soon`, `Active`, `Showing`, `Pending`, `Under Contract` all appear. Sorted by stage progression (Coming Soon → Under Contract) then most-recent list date first.

To deactivate a row, edit it in the Sheet directly: change `stage` to `Closed` / `Killed` / `Withdrawn` / `Expired` — it disappears from the dashboard but stays in the historical record.

---

## Editing or removing rows

The forms only ADD. To change an existing deal's stage (e.g., mark Under Contract → Cleared to Close):

1. Open the relevant sheet.
2. Find the row.
3. Update the `stage` cell.

Save — next dashboard page load reflects the change.

Same for fixing typos or correcting dates: edit the row directly. To delete an entry entirely, delete the row.
