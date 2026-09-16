# Custom Home Cost Estimator — Setup

Two pieces to set up in Google:

1. **Victory Formation Cost Estimate Log** — Google Sheet that receives every logged estimate.
2. **Log a Cost Estimate** — Google Form the dashboard POSTs to.

Plan ~15 minutes end to end. Send me back three things at the end:
- The sheet ID
- The form's `/formResponse` URL
- A pre-filled link so I can pull the `entry.NNN` IDs

---

## 1 · Create the Sheet

Log into Google as `gvjbusiness@yahoo.com`.

- Go to [sheets.new](https://sheets.new)
- Rename to **Victory Formation Cost Estimate Log**
- Share → Anyone with the link → **Viewer**

---

## 2 · Create the Form

- Go to [forms.new](https://forms.new)
- Rename to **Log a Cost Estimate**
- Settings → Responses → **Link to Sheet** → pick **Victory Formation Cost Estimate Log** you just made

Add these questions **in this exact order and with these exact lowercase labels**. All are Short answer unless noted. Everything is optional so the form still submits even when a field is 0.

| # | Label | Type |
|---|---|---|
| 1  | estimate_name          | Short answer · required |
| 2  | client_name            | Short answer |
| 3  | property_address       | Short answer |
| 4  | build_psf              | Short answer (number) |
| 5  | sqft                   | Short answer (number) |
| 6  | pool_cost              | Short answer (number) |
| 7  | architect_fee          | Short answer (number) |
| 8  | designer_fee           | Short answer (number) |
| 9  | builder_fee_pct        | Short answer (number) |
| 10 | owner_rep_fee_pct      | Short answer (number) |
| 11 | construction_months    | Short answer (number) |
| 12 | interest_rate          | Short answer (number) |
| 13 | bank_fee_pct           | Short answer (number) |
| 14 | owner_equity           | Short answer (number) |
| 15 | capital_mode           | Short answer |
| 16 | ltc_ratio              | Short answer (number) |
| 17 | ltv_target             | Short answer (number) |
| 18 | appraised_value        | Short answer (number) |
| 19 | base_build             | Short answer (number) |
| 20 | total_hard             | Short answer (number) |
| 21 | builder_fee_amt        | Short answer (number) |
| 22 | owner_rep_fee_amt      | Short answer (number) |
| 23 | construction_interest  | Short answer (number) |
| 24 | bank_fee_amt           | Short answer (number) |
| 25 | total_soft             | Short answer (number) |
| 26 | total_project_cost     | Short answer (number) |
| 27 | loan_amount            | Short answer (number) |
| 28 | owner_equity_required  | Short answer (number) |
| 29 | computed_ltc           | Short answer (number) |
| 30 | computed_ltv           | Short answer (number) |
| 31 | blended_psf            | Short answer (number) |

The Sheet will auto-add a Timestamp column at position 1 when the form is linked — nothing to do there.

---

## 3 · Send me three things

1. **Sheet ID** — from the sheet URL. Looks like `1AbcDef…XYZ`.
2. **Form `/formResponse` URL** — open the form, click **Send** → link icon → copy the viewform URL → replace `/viewform` with `/formResponse` at the end.
3. **Pre-filled link with entry IDs** — in the form editor:
   - ⋮ menu → **Get pre-filled link**
   - Type a **distinct throwaway value in every field** (e.g., `TEST1`, `TEST2`, `9999`, `10000`, `100`, `200`, `MODE1`, `LTC1`, `LTV1`, `APPRAISED1`, `1111111`, `2222222`, …). Distinct values are important — I match them back to fields by value.
   - Click **Get link** at the bottom → copy the URL and paste back.

Once I have all three I'll fill `CHE_LOG_SHEET_ID`, `CHE_LOG_FORM_URL`, and `CHE_LOG_FIELD_MAP` in `index.html` and the **Log This Estimate** button + **Estimate Summary PDF** page start working immediately.

---

## What happens after wiring

**Log This Estimate button** appears in the Cost Estimator modal footer. One click captures:
- All 18 inputs (build $/SF, sqft, pool, architect, designer, builder/owner-rep fees, construction months, rate, bank fee, owner equity, capital mode + LTC/LTV settings)
- All 13 computed outputs (base build, total hard, fee $ amounts, interest, bank fee $, total soft, TPC, loan, equity required, LTC/LTV %, blended $/SF)
- The `estimate_name` (e.g., "Base", "Value Engineered", "Upgraded Finish") so multiple estimates against the same client are distinguishable

**Estimate Summary PDF page** at `estimate-summary.html` — pick a logged estimate from the dropdown, get a one-page Victory Formation-branded printable summary. Downloadable button in Custom Rep → Files.
