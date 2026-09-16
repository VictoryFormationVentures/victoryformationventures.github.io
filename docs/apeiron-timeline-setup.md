# Development Project Project Timeline — Cross-Agent Sync Setup

The interactive timeline already works locally — click any milestone and it saves to your browser. But if multiple agents work on the same project, we need a shared Google Sheet + Form so everyone sees the same state.

**Setup time:** ~5 minutes.

Send me back three things at the end:
1. Sheet ID
2. Form's `/formResponse` URL
3. Pre-filled link so I can extract the entry IDs

---

## 1 · Create the Sheet

Log into Google as `gabe@victoryformationventures.com`.

- Go to [sheets.new](https://sheets.new)
- Rename to **Development Project Project Timeline**
- Share → Anyone with the link → **Viewer**

---

## 2 · Create the Form

- Go to [forms.new](https://forms.new)
- Rename to **Development Project Timeline Update**
- Settings → Responses → **Link to Sheet** → pick **Development Project Project Timeline**

Add these **5 questions** in this exact order and with these exact lowercase labels:

| # | Label | Type | Required |
|---|---|---|---|
| 1 | project_id      | Short answer | ✅ |
| 2 | milestone_key   | Short answer | ✅ |
| 3 | state           | Short answer | ✅ |
| 4 | updated_by      | Short answer | — |
| 5 | notes           | Paragraph    | — |

**What each field means:**
- `project_id` — which project this update belongs to (e.g. `campbell`)
- `milestone_key` — which milestone (e.g. `design-final`, `const-framing`)
- `state` — one of `upcoming`, `progress`, `complete`
- `updated_by` — agent name who made the change
- `notes` — optional free text (e.g. "framing inspection failed — re-schedule")

The Sheet auto-adds a Timestamp column at position 1 when the form is linked. The dashboard reads the latest state per milestone by Timestamp, so the sheet is append-only history — you can audit who changed what and when.

---

## 3 · Send me three things

1. **Sheet ID** — from the sheet URL. Looks like `1AbcDef…XYZ`.

2. **Form `/formResponse` URL** — open the form editor → **Send** → link icon → copy the viewform URL → change `/viewform` to `/formResponse` at the end.

3. **Pre-filled link with entry IDs** — in the form editor:
   - ⋮ menu → **Get pre-filled link**
   - Type distinct throwaway values in every field (`P1`, `M1`, `S1`, `U1`, `N1`)
   - Click **Get link** at the bottom → copy → paste back to me

I'll fill in `TIMELINE_CONFIG` in `devproject.html` and cross-agent sync goes live.

---

## What happens after wiring

- Any agent clicks a milestone → it saves to the sheet within a second
- Any other agent viewing the same Campbell timeline sees the update on their next page load
- Full history preserved in the sheet — you can audit changes if needed

New projects (future clients) get their own timeline card wired the same way, just with a different `data-project` attribute in the HTML.
