# Team Access — Victory Formation Ventures Dashboard

The live dashboard is at:

```
https://gvj32.github.io/Dashboard/
```

The site is currently **publicly accessible** — anyone with the URL can view it. No login required. To share the dashboard with a teammate, just send them the link.

The underlying repository (`gvj32/Dashboard`) is also public on GitHub, which is what allows GitHub Pages to serve it on the Free plan.

## What "public" means in practice

| What people can do | Without the URL | With the URL |
|---|---|---|
| View the dashboard | No | Yes |
| Read the page source (including the Apps Script URL) | No | Yes |
| Submit a commission via the form | No | Yes |
| Push code changes to the repo | No (need GitHub write access) | No (need GitHub write access) |

The dashboard URL is not currently linked from anywhere — Google won't index it unless we tell them to, and the only way someone finds it is if you share it. Realistically the audience is exactly the people you've sent the link to.

## Known security caveat (form-side, not view-side)

The Apps Script `/exec` URL is embedded in `index.html` (visible to anyone who views the page source). Because of that:

- Anyone who finds the URL can use `curl` (or similar) to POST a forged commission entry directly to the Deal Log, bypassing the dashboard's form.
- Risk today: low. Nobody knows the URL except whoever you've shared it with.
- Risk grows the moment you share the URL more widely or it gets linked from a public page.

**The fix** (when you're ready): add a shared secret token. The dashboard quietly includes the token on every submit; the Apps Script rejects requests that don't include it. About 10 minutes of work in `Apps Script - Code.gs` + `index.html`. Ask Claude to wire this up whenever — the change is small.

## Tightening access later

If you decide you want the page itself to require sign-in (the "team-only" gate we originally discussed), the options ordered cheapest first:

1. **Cloudflare Pages + Cloudflare Access** — free for the first 50 users. Viewers sign in with Google, work email, or a one-time PIN. No GitHub account required for viewers. Setup is similar to what we did with GitHub Pages — one-time DNS + repo connection — and would replace this Pages site.
2. **Netlify Identity** — same idea, similar cost (free tier covers it).
3. **GitHub Enterprise** — enables "private Pages" with GitHub-account-based auth. Costs ~$21/user/month. Only makes sense if you're already paying for Enterprise for other reasons.

Switching to any of the above does not require code changes inside the dashboard — only changing where the page is hosted and how it's gated.

## Custom domain (later)

Once content is built out and we're ready, point a subdomain like `dashboard.victoryformationventures.com` at the Pages site:

1. In the repo: `Settings → Pages → Custom domain` → enter `dashboard.victoryformationventures.com` → Save.
2. At wherever `victoryformationventures.com`'s DNS lives (currently Wix, I believe): add a CNAME record pointing `dashboard` → `gvj32.github.io`.
3. Wait for GitHub to issue a TLS cert (~10 minutes).

After that, both URLs (`.github.io/Dashboard/` and `dashboard.victoryformationventures.com`) will resolve to the same site.
