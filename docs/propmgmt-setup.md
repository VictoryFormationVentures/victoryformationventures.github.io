# Property Management — Setup

The Property Management division has 6 subtabs — Overview, **Properties**, **Tenants**, **Ledger**, Owner Reports (phase 2), and Files. The three data-driven subtabs each need their own Google Sheet + Google Form.

Plan ~30 minutes total: 3 Sheets, 3 Forms, 3 sets of entry IDs to paste.

---

## 1 · Create the three Sheets

Log into Google as `gvjbusiness@yahoo.com`.

For each, go to [sheets.new](https://sheets.new) and rename:

| Sheet name | Purpose |
|---|---|
| **Victory Formation Properties** | Every property under management |
| **Victory Formation Tenants** | Tenant contacts + lease info |
| **Victory Formation Ledger** | Rent + utility log per property |

Share → Anyone with the link → Viewer for each.

---

## 2 · Create the three Forms

### 2a · Properties form

Name it **Add Property**. Add these questions IN ORDER with these exact lowercase labels:

| # | Label | Type |
|---|---|---|
| 1 | property_address | Short answer · required |
| 2 | property_type | Dropdown: Single Family / Condo / Multi-Family / Townhome / Other |
| 3 | unit_count | Short answer (number) |
| 4 | bedrooms | Short answer (number) |
| 5 | bathrooms | Short answer (number) |
| 6 | neighborhood | Short answer |
| 7 | owner_name | Short answer · required |
| 8 | owner_email | Short answer |
| 9 | owner_phone | Short answer |
| 10 | owner_mailing | Short answer |
| 11 | monthly_rent | Short answer (number) |
| 12 | mgmt_fee_pct | Short answer (number) |
| 13 | lease_start | Date |
| 14 | lease_end | Date |
| 15 | occupied | Multiple choice: Yes / No |
| 16 | tenant_name | Short answer |
| 17 | notes | Paragraph |

Settings → Responses → Link to Sheet → **Victory Formation Properties**.

### 2b · Tenants form

Name it **Add Tenant**. Fields:

| # | Label | Type |
|---|---|---|
| 1 | first_name | Short answer · required |
| 2 | last_name | Short answer · required |
| 3 | email | Short answer |
| 4 | phone | Short answer |
| 5 | emergency_contact | Short answer |
| 6 | status | Dropdown: Active / Notice Given / Late / Past |
| 7 | property_address | Short answer · required |
| 8 | unit | Short answer |
| 9 | monthly_rent | Short answer (number) |
| 10 | deposit | Short answer (number) |
| 11 | lease_start | Date · required |
| 12 | lease_end | Date · required |
| 13 | move_in | Date |
| 14 | pet_fees | Short answer |
| 15 | notes | Paragraph |

Link to **Victory Formation Tenants** sheet.

### 2c · Ledger form

Name it **Log Ledger Entry**. Fields:

| # | Label | Type |
|---|---|---|
| 1 | entry_date | Date · required |
| 2 | property_address | Short answer · required |
| 3 | category | Dropdown: Rent / Water / Electric / Gas / Internet · required |
| 4 | amount | Short answer (number) · required |
| 5 | notes | Paragraph |

Link to **Victory Formation Ledger** sheet.

---

## 3 · Get the formResponse URLs and entry IDs

For each form:

1. Send → Link → copy the viewform URL → replace `/viewform` with `/formResponse`. That's the `FORM_URL`.
2. Form → ⋮ menu → **Get pre-filled link** → fill placeholder values → copy the resulting link.
3. Extract every `entry.NNN` value.

---

## 4 · Wire the CONFIGs in `index.html`

Find these three blocks near the "PROPERTY MANAGEMENT" section header and fill in:

```js
const PROPERTIES_CONFIG = { SHEET_ID: "…", SHEET_TAB: "Form Responses 1", FORM_URL: "…", FIELD_MAP: { /* 17 entry IDs */ } };
const TENANTS_CONFIG    = { SHEET_ID: "…", SHEET_TAB: "Form Responses 1", FORM_URL: "…", FIELD_MAP: { /* 15 entry IDs */ } };
const LEDGER_CONFIG     = { SHEET_ID: "…", SHEET_TAB: "Form Responses 1", FORM_URL: "…", FIELD_MAP: { /* 5 entry IDs */ } };
```

The order of fields in `FIELD_MAP` matches the modal HTML in the Add Property / Add Tenant / Log Entry modals.

---

## 5 · Commit + push

Once both CONFIGs are filled in, commit and push. GitHub Pages picks up within a minute.

---

## How it behaves after wiring

- **Overview** → auto-calculates 6 tiles from the two sheets: Properties Under Management, Occupied Units, Active Tenants, Leases Ending Soon, Monthly Rent Roll, Monthly Mgmt Fees
- **Properties** → list with search + filter (occupied/type) + CSV export
- **Tenants** → list with search + status filter + CSV export
- **Ledger** → filter by property + month + category. Six tile totals (Rent + 4 utilities + count). Log a new entry with the modal. Export filtered CSV. Generate a Monthly Statement PDF for one property + one month → opens `monthly-statement.html?property=…&month=YYYY-MM` in a new tab.
- **Owner Reports** → placeholder for quarterly + YTD rollups (phase 2)
- **Files** → static PDF cards (currently placeholders for the 4 templates: Management Agreement, Owner Onboarding, Tenant Application, Lease Template)

**Autocomplete**: When adding a tenant or ledger entry, the property address field auto-suggests from the loaded Properties list. Type the first few characters and pick — keeps addresses spelled consistently across sheets.

**Cross-sheet linking**: Tenants + Ledger reference properties by `property_address` (free text). Keep the address spelling identical to what's in the Properties sheet so tiles, filters, and the monthly statement report work correctly.

## Monthly Statement PDF

The monthly statement is a Victory Formation-branded one-page PDF that both tenant and landlord receive. It shows:

- Header: Victory Formation arch + Property Management, month label
- Property address (title)
- Two parties block: Landlord + Tenant contact info (pulled from Properties + Tenants sheets)
- Category totals (Rent, Water, Electric, Gas, Internet)
- Full activity table: date, category, notes, amount for each ledger entry in that month
- Subtotals: Utilities, Rent, Total Activity

To generate: on the Ledger tab, filter to one property + one month, then click **Generate Monthly Statement**. Browser opens `monthly-statement.html` in a new tab → click **Print / Save PDF** → save. Email to both parties.

---

## Editing existing rows

Forms only ADD. To update a property's rent, occupancy, or notes — edit the row directly in the Google Sheet. Same for tenants and ledger entries. Next dashboard load reflects it.

To fix a wrong ledger amount: edit the row directly in the Victory Formation Ledger sheet. To reverse a mistake without deleting: log an offsetting entry with a Notes explanation (better audit trail).
