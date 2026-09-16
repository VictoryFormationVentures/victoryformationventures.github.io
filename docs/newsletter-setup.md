# Monthly Client Newsletter — Setup

The dashboard handles audience curation (your CRM + Open House visitors). **Brevo** handles the actual send. This guide walks you through one-time Brevo setup so monthly sends take ~15 minutes start to finish.

**One-time setup plan:** ~30 minutes including DNS records.

---

## Why Brevo (not Outlook)

Your Outlook account is built for one-to-one email. Sending bulk newsletters from it will:
- Get your messages flagged as spam (rate limits kick in around 100–500/day depending on account type)
- Damage your sender reputation for ALL emails — meaning offer letters, closing docs, and personal email start going to spam too
- Violate Microsoft's terms of service for mailbox sending
- Skip the legally required unsubscribe link (CAN-SPAM)

Brevo (formerly Sendinblue) is built for this. Free tier covers 300 sends/day and unlimited contacts. Your sender identity will still be `gvjbusiness@yahoo.com` — recipients see your address and replies still hit your Outlook inbox. Brevo just handles the send.

---

## 1 · Create your Brevo account

1. Go to [brevo.com](https://www.brevo.com) → **Sign up free**
2. Use `gvjbusiness@yahoo.com` (or your preferred admin email)
3. Set up your company profile: **Victory Formation Ventures** · 206 Ben Allen Rd #7, Austin TX 78701 · real estate
4. Skip the paid upsell on the way through — the free **Starter** plan is fine

---

## 2 · Verify your sender address

This proves to Brevo that you control the email address you're sending from.

1. Brevo dashboard → **Senders, Domains & Dedicated IPs** (under Settings) → **Senders** tab
2. **Add a sender** → fill in:
   - Sender name: `Gabe Jeudy-Lally`
   - Email: `gvjbusiness@yahoo.com`
3. Click **Save** → Brevo emails a verification link to that address
4. Open the verification email → click the link → sender is now verified

---

## 3 · Authenticate your domain (the critical step)

This is what makes your emails actually land in inboxes instead of spam folders. Skipping it is the #1 reason DIY newsletters fail.

1. Brevo dashboard → **Senders, Domains & Dedicated IPs** → **Domains** tab → **Add a domain**
2. Enter: `victoryformationventures.com`
3. Brevo shows you 3 DNS records to add — typically:
   - **DKIM** (TXT record)
   - **DMARC** (TXT record)
   - **SPF** (TXT record, OR an update to your existing SPF record)
4. Go to wherever you bought `victoryformationventures.com` (GoDaddy, Namecheap, Google Domains, Cloudflare, etc.) → log in → DNS settings
5. Add each of the 3 records Brevo provided. Copy values **exactly** — no leading/trailing spaces.
6. Wait 15 min (sometimes up to 48 hrs), then back in Brevo click **Verify domain**
7. Once all 3 show green ✓, you're authenticated.

**If you don't own the domain yet:** buy `victoryformationventures.com` first (or use `victoryformationventures.com` if you already own that — just update the sender address to match). Domain registration is ~$15/year.

---

## 4 · Import your audience CSV

1. In the dashboard: Sales → **Newsletter** → tick the categories you want (Past + Active + Sphere + OH by default)
2. Confirm the "Audience Size" tile shows a reasonable number
3. Click **Export Audience CSV** → downloads `vfv-newsletter-audience-YYYY-MM-DD.csv`
4. In Brevo: **Contacts** → **Import contacts** → **Upload from a file**
5. Select the CSV → Brevo will preview the first few rows
6. Map columns (Brevo auto-detects most):
   - `EMAIL` → Email (required)
   - `FIRSTNAME` → First Name
   - `LASTNAME` → Last Name
   - `SMS` → SMS (Brevo's phone field)
   - `CATEGORIES` → create as new attribute (Text, multi-value)
   - `CITY` → create as new attribute
   - `NEIGHBORHOOD` → create as new attribute
   - `LAST_TOUCH` → create as new attribute (Date)
7. **Assign to a list** → create a new list called `Victory Formation Clients` (do this on the first import — subsequent imports add to the same list)
8. Confirm opt-in: tick "I have permission to contact these subscribers" (you do — your clients and OH sign-ins are opted in)
9. **Import** → Brevo will confirm "X contacts imported"

---

## 5 · Send your first newsletter

For now (until we build the Victory Formation-branded composer in Phase 2), build the email inside Brevo:

1. Brevo → **Campaigns** → **Create a campaign** → **Email**
2. **Campaign name** (internal): `2026-07 Monthly Update` (use YYYY-MM format so they sort)
3. **Subject line**: something specific. Bad: "Victory Formation Newsletter". Good: "July at Victory Formation: 3 new listings + 2 closings"
4. **Preview text** (the gray text after the subject in the inbox preview): one short sentence that complements the subject — gets you ~5-10% more opens
5. **From name + email**: Gabe Jeudy-Lally / gvjbusiness@yahoo.com
6. **Recipients**: select your `Victory Formation Clients` list
7. **Design** → use the **Drag & Drop editor** → pick a clean template → edit:
   - Header: Victory Formation arch icon (upload from `assets/icon-arch-transparent.png`)
   - Hero block: photo + headline
   - Listing grid: 2-3 listings, photo + address + price + "View details" link
   - Closing block: "Looking to buy or sell? Just hit reply." + signature
   - Footer: Brevo auto-adds the legally required unsubscribe link + business address (which you set in step 1)
8. **Preview & test** → send a test to your own email first → review on phone + desktop
9. **Schedule** for first of the month at 9 AM CT (open rates spike at 9-10 AM on weekdays)

---

## 6 · Recurring monthly workflow

Once Brevo is set up, each month:

1. Dashboard → Sales → Newsletter → **Export Audience CSV** (your list grows monthly)
2. Brevo → Contacts → Import → upload the new CSV → **Update existing contacts** option (so it just adds new ones)
3. Brevo → Campaigns → **Duplicate** last month's campaign → update subject + content
4. Schedule send

Time per month: ~15 minutes.

---

## Compliance notes (the boring but important part)

- Brevo's unsubscribe link is mandatory and included by default — DO NOT remove it
- Your business address must be in the footer — Brevo pulls this from the company profile you set in step 1
- For Past Clients: you have a prior business relationship, no extra opt-in required under CAN-SPAM
- For Sphere: best practice is to add a "How we got your email" line on the first send so people know why they're receiving it
- For OH Visitors: they opted in when they signed your sheet
- For Prospects: only include if you're sure they expect contact from you

If anyone unsubscribes via Brevo's link, they're automatically excluded from future imports of the same email — even when you re-upload the CSV. Brevo's suppression list is permanent.

---

## Phase 2 — Victory Formation-branded composer (coming later)

Once you spec the section structure (hero / listings / featured / market note / CTA / etc.), we'll build a form-based composer in the dashboard that generates a Victory Formation-styled HTML email. You'll copy-paste into Brevo instead of using their drag-drop editor. Until then, Brevo's editor + a clean template will work fine.
