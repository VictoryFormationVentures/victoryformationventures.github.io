# Move-In Report → Auto-Email PDF Setup

**Goal:** the moment a tenant submits the online Move-In Report, you get an email at `gabe@victoryformationventures.com` with a Victory Formation-branded PDF summary attached.

**Setup time:** ~5 minutes, one-time.

**What powers this:** a Google Apps Script attached to your Move-In Reports sheet. Free, runs inside Google, no third-party services.

---

## 1 · Open the Apps Script editor

- Open [your Move-In Reports sheet](https://docs.google.com/spreadsheets/d/PASTE_YOUR_SHEET_ID/edit)
- Top menu: **Extensions → Apps Script**
- A new tab opens with a code editor. Delete anything that's already there.

## 2 · Paste this exact script

Copy the entire block below and paste it into the editor.

```javascript
/**
 * Move-In Report → PDF Email
 * Fires when a tenant submits the online Move-In Report form.
 * Builds a Victory Formation-branded PDF summary and emails it to Gabe.
 */

const CONFIG = {
  TO_EMAIL:     'gabe@victoryformationventures.com',
  FROM_NAME:    'Victory Formation Ventures',
  BRAND_COLOR:  '#111',
  ACCENT_COLOR: '#eae2d3',
  ARCH_LOGO_URL: 'https://victoryformationventures.github.io/assets/icon-arch-black.png'
};

/**
 * Trigger entry point — installed on the sheet, not the form.
 * The `e` event object provides the row data as `namedValues`:
 *   { 'property_address': ['1234 Main St'], 'tenant_name': ['Jane Doe'], ... }
 */
function onFormSubmit(e) {
  try {
    const v = e && e.namedValues ? e.namedValues : {};
    const get = (k) => (v[k] && v[k][0]) ? v[k][0] : '';

    const property = get('property_address') || 'Unknown property';
    const tenant   = get('tenant_name')      || 'Unknown tenant';

    const html = buildReportHtml(v);
    const pdfBlob = htmlToPdf(html, 'Move-In Report - ' + property);

    const subject = 'Move-In Report — ' + tenant + ' at ' + property;
    MailApp.sendEmail({
      to:       CONFIG.TO_EMAIL,
      subject:  subject,
      htmlBody: buildEmailIntro(v) + html,
      name:     CONFIG.FROM_NAME,
      attachments: [pdfBlob]
    });
  } catch (err) {
    // Fallback: at least email plaintext so nothing is lost
    MailApp.sendEmail(
      CONFIG.TO_EMAIL,
      '⚠ Move-In Report submit error',
      'Apps Script errored while processing a form submit.\n\nError: ' + err +
      '\n\nRaw form values:\n' + JSON.stringify(e && e.namedValues, null, 2)
    );
    throw err;
  }
}

/* ----------------------------------------------------------------
   HTML → PDF via a temp Google Doc conversion.
   Requires: Services → Drive API (add it in the left sidebar).
   ---------------------------------------------------------------- */
function htmlToPdf(html, filename) {
  const htmlBlob = Utilities.newBlob(html, 'text/html', filename + '.html');
  const docFile = Drive.Files.create({
    name: filename,
    mimeType: 'application/vnd.google-apps.document'
  }, htmlBlob);
  const pdf = DriveApp.getFileById(docFile.id).getAs('application/pdf')
    .setName(filename.replace(/[^\w\-]+/g, '_') + '.pdf');
  DriveApp.getFileById(docFile.id).setTrashed(true);
  return pdf;
}

/* ----------------------------------------------------------------
   Short intro paragraph at the top of the email body
   ---------------------------------------------------------------- */
function buildEmailIntro(v) {
  const g = (k) => (v[k] && v[k][0]) ? v[k][0] : '';
  return `
    <div style="font-family:Helvetica,Arial,sans-serif; padding:14px 20px 6px; background:#f5f2ec; border-bottom:1px solid #ddd;">
      <p style="margin:0 0 6px; font-size:13px; color:#333;">
        <strong>${g('tenant_name')}</strong> just submitted a move-in report for
        <strong>${g('property_address')}${g('unit') ? ' · ' + g('unit') : ''}</strong>.
        Inspection date: <strong>${g('inspection_date')}</strong>.
      </p>
      <p style="margin:0; font-size:12px; color:#666;">
        PDF summary attached. Full report below.
      </p>
    </div>
  `;
}

/* ----------------------------------------------------------------
   Build the full HTML report (used for both email body + PDF)
   ---------------------------------------------------------------- */
function buildReportHtml(v) {
  const g = (k) => (v[k] && v[k][0]) ? v[k][0] : '';
  const esc = (s) => String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const ROOMS = [
    ['entry',       'Entry / Foyer'],
    ['living',      'Living Room'],
    ['dining',      'Dining Room'],
    ['kitchen',     'Kitchen (Structure)'],
    ['appliances',  'Kitchen Appliances'],
    ['master_br',   'Master Bedroom'],
    ['bedroom2',    'Bedroom 2'],
    ['bedroom3',    'Bedroom 3'],
    ['bedroom4',    'Bedroom 4'],
    ['bedroom5',    'Bedroom 5'],
    ['master_bath', 'Master Bathroom'],
    ['bath2',       'Bathroom 2'],
    ['bath3',       'Bathroom 3'],
    ['bath4',       'Bathroom 4'],
    ['bath5',       'Bathroom 5'],
    ['laundry',     'Laundry (Washer & Dryer)'],
    ['garage',      'Garage / Water Heater / HVAC'],
    ['exterior',    'Exterior / Yard / Deck']
  ];

  // Build room rows, skipping rooms with no condition selected
  const roomRows = ROOMS
    .map(([key, label]) => {
      const cond = g(key + '_condition');
      const notes = g(key + '_notes');
      if (!cond && !notes) return '';
      const condColor = ({
        'Good': '#2a5a24', 'Fair': '#8a6d1e', 'Poor': '#a4491d',
        'Damaged': '#a4291d', 'Missing': '#a4291d', 'N/A': '#888'
      })[cond] || '#111';
      return `
        <tr>
          <td style="padding:8px 10px; border-bottom:1px solid #e5e5e5; font-weight:600; width:33%;">${esc(label)}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #e5e5e5; color:${condColor}; font-weight:600; width:15%;">${esc(cond) || '—'}</td>
          <td style="padding:8px 10px; border-bottom:1px solid #e5e5e5;">${esc(notes) || '<span style="color:#aaa;">—</span>'}</td>
        </tr>
      `;
    })
    .join('');

  return `
<!doctype html>
<html><head><meta charset="utf-8" /><title>Move-In Report</title></head>
<body style="margin:0; padding:0; font-family: Helvetica, Arial, sans-serif; color:#111; background:#fff;">
<div style="max-width:720px; margin:0 auto; padding:24px;">

  <!-- Header -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-bottom:1px solid #ccc; padding-bottom:14px; margin-bottom:18px;">
    <tr>
      <td>
        <div style="font-size:15px; letter-spacing:.28em; text-transform:uppercase; font-weight:700;">Victory Formation Ventures</div>
        <div style="font-size:9px; letter-spacing:.22em; text-transform:uppercase; color:#666; margin-top:3px; font-weight:600;">Property Management</div>
      </td>
      <td align="right">
        <img src="${CONFIG.ARCH_LOGO_URL}" width="42" height="42" alt="" style="display:block;" />
      </td>
    </tr>
  </table>

  <h1 style="font-size:24px; letter-spacing:.16em; text-transform:uppercase; margin:0 0 4px; font-weight:400;">Tenant Move-In Report</h1>
  <div style="font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:#666; margin-bottom:22px;">Walk-through Inspection</div>

  <!-- Property + Tenant -->
  <h2 style="font-size:12px; letter-spacing:.2em; text-transform:uppercase; padding-bottom:5px; border-bottom:1px solid #ccc; margin:0 0 10px;">Property &amp; Tenant</h2>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px; margin-bottom:22px;">
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666; width:32%;"><strong>Property</strong></td>
      <td style="padding:5px 0;">${esc(g('property_address'))}${g('unit') ? ' · Unit ' + esc(g('unit')) : ''}</td>
    </tr>
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666;"><strong>Tenant</strong></td>
      <td style="padding:5px 0;">${esc(g('tenant_name'))}</td>
    </tr>
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666;"><strong>Email</strong></td>
      <td style="padding:5px 0;">${esc(g('tenant_email'))}</td>
    </tr>
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666;"><strong>Phone</strong></td>
      <td style="padding:5px 0;">${esc(g('tenant_phone')) || '—'}</td>
    </tr>
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666;"><strong>Lease Start</strong></td>
      <td style="padding:5px 0;">${esc(g('lease_start')) || '—'}</td>
    </tr>
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666;"><strong>Inspection Date</strong></td>
      <td style="padding:5px 0;">${esc(g('inspection_date'))}</td>
    </tr>
  </table>

  <!-- Rooms -->
  <h2 style="font-size:12px; letter-spacing:.2em; text-transform:uppercase; padding-bottom:5px; border-bottom:1px solid #ccc; margin:0 0 6px;">Room-by-Room</h2>
  ${roomRows ? `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px; margin-bottom:22px; border-top:1px solid #e5e5e5;">
      <thead>
        <tr style="background:#f5f2ec;">
          <th style="text-align:left; padding:8px 10px; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#666; font-weight:700; border-bottom:1px solid #ccc;">Room</th>
          <th style="text-align:left; padding:8px 10px; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#666; font-weight:700; border-bottom:1px solid #ccc;">Condition</th>
          <th style="text-align:left; padding:8px 10px; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#666; font-weight:700; border-bottom:1px solid #ccc;">Notes</th>
        </tr>
      </thead>
      <tbody>${roomRows}</tbody>
    </table>
  ` : '<p style="font-size:13px; color:#888; margin-bottom:22px;"><em>No rooms recorded.</em></p>'}

  <!-- Safety, Keys, Photos, Overall -->
  <h2 style="font-size:12px; letter-spacing:.2em; text-transform:uppercase; padding-bottom:5px; border-bottom:1px solid #ccc; margin:0 0 10px;">Safety, Keys &amp; Access</h2>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:13px; margin-bottom:22px;">
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666; width:32%;"><strong>Detectors</strong></td>
      <td style="padding:5px 0;">${esc(g('detectors_status'))}${g('detectors_notes') ? ' — ' + esc(g('detectors_notes')) : ''}</td>
    </tr>
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666;"><strong>Keys / Remotes</strong></td>
      <td style="padding:5px 0;">${esc(g('keys_count'))}</td>
    </tr>
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666;"><strong>Alarm / Gate Codes</strong></td>
      <td style="padding:5px 0;">${esc(g('alarm_code')) || '—'}</td>
    </tr>
    <tr>
      <td style="padding:5px 12px 5px 0; color:#666;"><strong>Photo Album</strong></td>
      <td style="padding:5px 0;">${g('photo_link') ? '<a href="' + esc(g('photo_link')) + '">' + esc(g('photo_link')) + '</a>' : '—'}</td>
    </tr>
  </table>

  ${g('overall_notes') ? `
  <h2 style="font-size:12px; letter-spacing:.2em; text-transform:uppercase; padding-bottom:5px; border-bottom:1px solid #ccc; margin:0 0 10px;">Additional Notes</h2>
  <p style="font-size:13px; line-height:1.55; margin:0 0 22px; white-space:pre-wrap;">${esc(g('overall_notes'))}</p>
  ` : ''}

  <!-- Signature -->
  <h2 style="font-size:12px; letter-spacing:.2em; text-transform:uppercase; padding-bottom:5px; border-bottom:1px solid #ccc; margin:0 0 10px;">Electronic Signature</h2>
  <div style="background:#fdfbf5; border:1px solid #cabf9e; padding:14px 16px; margin-bottom:24px;">
    <p style="font-size:11px; line-height:1.5; color:#666; margin:0 0 10px;">
      Tenant typed the following as their electronic signature, acknowledging inspection accuracy under the E-SIGN Act:
    </p>
    <div style="font-family: 'Times New Roman', serif; font-size:22px; letter-spacing:.02em; color:#111;">
      ${esc(g('signature_name'))}
    </div>
    <div style="font-size:11px; color:#666; margin-top:8px;">
      Signed on ${esc(g('signature_date'))}
    </div>
  </div>

  <p style="font-size:10px; color:#999; text-align:center; letter-spacing:.15em; text-transform:uppercase;">
    Victory Formation Ventures · Property Management · victoryformationventures.com
  </p>

</div>
</body></html>
  `;
}
```

## 3 · Enable the Drive API

The PDF conversion needs the **Drive Advanced Service**:

- In the Apps Script editor, left sidebar → click **Services** (the `+` icon next to Services)
- Scroll to find **Drive API** → click it
- In the popup: Version = `v3` (default) → click **Add**
- The service appears in the left sidebar as `Drive`

## 4 · Save the script

- Top toolbar: click the disk/save icon (or `Cmd + S`)
- Give the project a name if prompted: **"Move-In Report Email"**

## 5 · Install the trigger

- Left sidebar → click the **clock icon** (Triggers)
- Bottom right → **+ Add Trigger**
- Fill in:
  - **Function to run:** `onFormSubmit`
  - **Deployment:** `Head`
  - **Event source:** `From spreadsheet`
  - **Event type:** `On form submit`
  - **Failure notifications:** `Notify me immediately`
- Click **Save**

## 6 · Grant permissions

Google will prompt you to authorize the script:

- Click **Review permissions**
- Sign in as `gabe@victoryformationventures.com`
- You may see "Google hasn't verified this app" — click **Advanced → Go to Move-In Report Email (unsafe)**
  - This is normal for personal scripts; you're the author, so it's safe.
- Click **Allow** to grant:
  - Send email as you
  - See, edit, create, delete Drive files
  - Connect to external services

## 7 · Test it

- Open your dashboard: `Property Management → Files → Tenant Move-In Report → Preview Form`
- Fill it in as if you were a tenant
- Submit
- Within 30–60 seconds you should get an email at `gabe@victoryformationventures.com` with the PDF attached

If nothing arrives:
- Check spam / promotions folder
- Open the Apps Script editor → **Executions** (icon on the left) — you'll see the run and any error
- If the trigger errored, you'll get a "Summary of failures" email from Google to the admin address; forward it to me and I'll debug

---

## What happens now

Every form submission triggers this script within seconds. You get:
- **Email** with a Victory Formation-branded HTML summary inline (readable on phone)
- **PDF attachment** (`Move-In Report - 1234 Main St.pdf`) suitable for archiving
- **Sheet row** as before (Google Forms handles that automatically)

To change the recipient later: edit `TO_EMAIL` at the top of the script and save.

To also CC someone: change `MailApp.sendEmail({...})` to include `cc: 'other@example.com'`.
