# Apps Script — `doGet` endpoint for the Dashboard

The Sales Commission Tracker spreadsheet already has an Apps Script Web App with a `doPost` handler (used by the form). This adds a `doGet` handler so the public dashboard can pull live YTD numbers.

## What it returns

```json
{
  "deals":    12,
  "volume":   18450000,
  "avgPrice": 1537500,
  "agents":   3,
  "updated":  "2026-05-17T14:22:11.000Z"
}
```

| Field      | Meaning                                                  | Source                                       |
|------------|----------------------------------------------------------|----------------------------------------------|
| `deals`    | Number of closed deals year-to-date                      | Count of Deal Log rows where YEAR(D) = today |
| `volume`   | Total sales volume YTD                                   | Sum of Deal Log col I (Sales Price), YTD     |
| `avgPrice` | Average sale price YTD                                   | `volume / deals` (0 if no deals)             |
| `agents`   | Number of agents on the Sales roster                     | Non-empty rows in `Agents` sheet, col A      |
| `updated`  | Server timestamp of the read                             | `new Date().toISOString()`                   |

## The code to paste

Open the Apps Script editor:

1. In the Google Sheet (`Sales Commission Tracker`), click **Extensions → Apps Script**.
2. Append the following `doGet` function to your existing script file (do not delete the existing `doPost`).
3. Click **Deploy → Manage deployments → ⚙️ Edit → New version → Deploy**.
   - **Execute as:** Me (`gvjbusiness@yahoo.com`)
   - **Who has access:** Anyone (this allows the dashboard to fetch without auth — only summary numbers are returned, no PII)
4. Copy the new `/exec` URL — that's what goes into `SHEETS_API_URL` in `index.html`.

```javascript
/**
 * GET endpoint — returns aggregate YTD dashboard JSON.
 * Deploy alongside the existing doPost.
 */
function doGet(e) {
  const ss      = SpreadsheetApp.getActiveSpreadsheet();
  const dealLog = ss.getSheetByName('Deal Log');
  const agentsT = ss.getSheetByName('Agents');

  const thisYear = new Date().getFullYear();

  // --- Deal Log: columns D (closing date) and I (sales price) ---
  let deals = 0;
  let volume = 0;

  if (dealLog && dealLog.getLastRow() > 1) {
    const rows = dealLog
      .getRange(2, 1, dealLog.getLastRow() - 1, 12)
      .getValues();

    rows.forEach(r => {
      const closing = r[3]; // col D — Date of Closing
      const price   = r[8]; // col I — Sales Price
      if (closing instanceof Date && closing.getFullYear() === thisYear) {
        deals  += 1;
        volume += Number(price) || 0;
      }
    });
  }

  const avgPrice = deals > 0 ? volume / deals : 0;

  // --- Agents roster: non-empty rows in col A (excluding header) ---
  let agents = 0;
  if (agentsT && agentsT.getLastRow() > 1) {
    const names = agentsT
      .getRange(2, 1, agentsT.getLastRow() - 1, 1)
      .getValues()
      .flat()
      .filter(v => v !== '' && v != null);
    agents = names.length;
  }

  const payload = {
    deals:    deals,
    volume:   volume,
    avgPrice: avgPrice,
    agents:   agents,
    updated:  new Date().toISOString()
  };

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Verifying it works

After deploying:

1. Open the new `/exec` URL in your browser. You should see the JSON above.
2. Paste that URL into `index.html` where it says `const SHEETS_API_URL = "";`.
3. Reload `index.html`. The four metric tiles will fill in and the "Updated" timestamp will appear.

## Why "Anyone" access is OK

Only **aggregate** numbers leave the spreadsheet — no addresses, names, or per-deal data. The dashboard never receives the raw rows.

If you ever want to lock it down: switch the deployment to "Anyone with the link" + add a shared secret query string (e.g. `?key=…`) and verify it in `doGet` against a `PropertiesService` value.
