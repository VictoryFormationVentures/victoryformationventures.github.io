# Connecting Your Own Data

The dashboard is a static site. All live data comes from Google Sheets (read) and Google Forms or Apps Script (write) in your own Google account. This copy shipped with every one of those wired to placeholders, so nothing reads or writes the original owner's data.

Search the code for these three strings to find every spot that needs a value:

```
PASTE_YOUR_SHEET_ID
PASTE_YOUR_FORM_ID
PASTE_YOUR_APPS_SCRIPT_ID
```

You do not have to do all of it at once. Each division works independently, so wire up the one you'll use first and leave the rest as empty states.

## The two patterns

**Reading from a Sheet.** The code fetches `https://docs.google.com/spreadsheets/d/<SHEET_ID>/gviz/tq?...`. For that to work the Sheet must be shared as "Anyone with the link can view". The Sheet ID is the long string in the Sheet's URL between `/d/` and `/edit`. Paste it into the matching `*_SHEET_ID` constant and make sure the `*_SHEET_TAB` name matches your tab name.

**Writing through a Form.** The code POSTs to `https://docs.google.com/forms/d/e/<FORM_ID>/formResponse`. Create a Google Form whose responses go to the Sheet above, open the Form's "Get pre-filled link", fill every question with a recognizable value, and copy the resulting link. The link contains the Form ID and one `entry.NNNNNNN=` per question. Paste the Form ID into `FORM_URL` and the entry numbers into the `FIELD_MAP` right below it.

## Feature map

Each feature lists its config name in `index.html` (search for it) and the doc that describes the expected columns.

| Feature | Config in code | Column layout doc |
|---|---|---|
| Sales overview stats | `SHEET_ID` / `STATS_CSV_URL` (first script block) | `apps-script-doGet.md` |
| Land pipeline | `LAND_SHEET_ID` | `active-deals-setup.md` |
| Custom Home Owners Rep pipeline | `CUSTOMREP_SHEET_ID` | `che-setup.md` |
| Development pipeline | `DEV_SHEET_ID` | `active-deals-setup.md` |
| Underwriting log | `UW_LOG_SHEET_ID`, `UW_LOG_FORM_URL`, `UW_LOG_FIELD_MAP` | (comments above the constant) |
| Custom Home Estimate log | `CHE_LOG_SHEET_ID`, `CHE_LOG_FORM_URL` | `che-setup.md` |
| Open house sign-in | `FORM_URL` + `FIELD_MAP` in the Open House block | (comments above the constant) |
| Listings | `LISTINGS_SHEET_ID` | (comments above the constant) |
| Team roster and agent passcodes | `TEAM_CONFIG` | `team-setup.md` |
| Buyer deals | `BUYERDEAL_CONFIG` | `clients-setup.md` |
| Listing deals | `LISTING_CONFIG` | `clients-setup.md` |
| Nurturing | `NURTURING_CONFIG` | `nurturing-setup.md` |
| Clients | `CLIENTS_CONFIG` | `clients-setup.md` |
| Property management (properties, tenants, ledger) | `PROPERTIES_CONFIG`, `TENANTS_CONFIG`, `LEDGER_CONFIG`, `MOVEIN_REPORTS_SHEET_ID` | `propmgmt-setup.md`, `movein-report-setup.md` |
| Contacts | `CONTACTS_CONFIG` | `contacts-setup.md` |
| Buy boxes | `BUYBOX_CONFIG` | `buybox-setup.md` |
| Hot leads | `HOTLEAD_CONFIG` | `hotleads-setup.md` |
| Newsletter | see `newsletter-setup.md` | `newsletter-setup.md` |

`land.html` and `devproject.html` have their own small set of the same placeholders (the Land page re-uses the Land pipeline Sheet; the Development project page has contacts, team roster, and a form).

## Files that upload to GitHub

Some tools (listing photos, development renderings, plans) save files straight into this repo through the GitHub API. They ask for a personal access token the first time and keep it in your browser only. Create one at https://github.com/settings/personal-access-tokens/new scoped to the `VictoryFormationVentures/victoryformationventures.github.io` repo with Contents: read and write. The repo owner constants (`REPO_OWNER`, `_GH_REPO_OWNER`) are already set to `VictoryFormationVentures` organization (owned by your gvj32 account).

## Things that were Nashville-specific and now need Austin equivalents

- The parcel lookup in `land.html` (`CITY_META` and the `_plQueryLayer` calls) used Metro Nashville's ArcGIS geocoder and parcel layer. Travis County (TCAD) and Williamson County (WCAD) publish their own GIS services; wire those in when you want the lookup back. The research panels for Austin, West Lake Hills, Round Rock, and Georgetown are placeholders ready for your zoning notes.
- CMA PDF import was written against RealTracs (Nashville MLS) PDF layouts. Unlock MLS (Austin) exports look different, so the parser will need a pass once you have a sample PDF.
- Contract references now say TREC One to Four Family Residential Contract instead of the Tennessee TAR form. The PDF prefill in the deal intake was tuned to the TAR layout and will need the same treatment.

## Original-owner references

Everything branded, named, or located in Nashville was replaced in a scripted pass. If you find a stray, search for `Stonehouse`, `Nashville`, `Davidson`, or `615` and fix it in place.
