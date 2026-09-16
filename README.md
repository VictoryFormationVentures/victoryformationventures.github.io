# Victory Formation Ventures — Internal Dashboard

The internal workspace for Victory Formation Ventures, covering the greater Austin market (Travis County and Williamson County, Texas). One page, division tabs, plus a set of document generators (LOI, CMA, deal report, investor deck, engagement letter, and more).

Live site: https://victoryformationventures.github.io/

This is a rebranded copy of the Stonehouse Company dashboard, ported from Nashville to Austin. The tooling is identical; the data is not shared.

## Access codes

Admin: `0000`. Land Acquisition: `5555`. Codes live in `index.html` near `ACCESS_CODES` and `LAND_CODES`; change them there and bump `ACCESS_VERSION` to log everyone out.

## What's in here

```
Dashboard/
├── index.html                ← the dashboard hub (all division tabs)
├── land.html                 ← Land Acquisition division page
├── devproject.html           ← Development project page (generic placeholder)
├── premier-listings/         ← luxury listings microsite (generic placeholder)
├── *.html                    ← document generators (LOI, CMA, OM, one-pager, etc.)
├── assets/                   ← logos, fonts, icons, uploads
└── docs/                     ← setup guides (start with SETUP-YOUR-DATA.md)
```

## Running it

Open `index.html` in any browser. No build step, no server, no dependencies.

## Connecting your own data

The dashboard reads from Google Sheets and writes through Google Forms and Apps Script. Every reference to the original owner's Google resources has been replaced with `PASTE_YOUR_SHEET_ID`, `PASTE_YOUR_FORM_ID`, or `PASTE_YOUR_APPS_SCRIPT_ID`. Until those are filled in, the tabs show empty states and forms will not submit.

See `docs/SETUP-YOUR-DATA.md` for the walkthrough, division by division.

## Brand tokens

| Token          | Value      |
|----------------|------------|
| Background     | `#000000`  |
| Text           | `#FFFFFF`  |
| Muted          | `#B4B4B4`  |
| Dim            | `#707070`  |
| Display font   | Aboreto    |
| Body font      | Montserrat |

The logo files in `assets/` (`AppLogo.png`, `icon-*.png`, `apple-touch-icon.png`, `mark-email.png`) are generated placeholders. Replace them with the real Victory Formation Ventures mark at the same dimensions.

## Deploying

Hosted on GitHub Pages from the `main` branch of `VictoryFormationVentures/victoryformationventures.github.io`. Commit and push; the site updates in about a minute.
