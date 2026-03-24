# ServiceNow Smart Navigator

Intelligent search and navigation tool for ServiceNow Next Experience (Polaris / Zurich release).

## What it does

- **Fuzzy module search** — finds any SN module by name, keyword, or partial match
- **Semantic intent detection** — reads text clues to route to the right table:
  - `memory issue` → Incidents
  - `deploy server` → Changes
  - `root cause recurring` → Problems
  - `portia relationships` → CMDB Relationships (CI name extracted)
  - `laptop warranty` → Assets
  - `vpn access request` → Access/Service Requests
- **Record number jump** — `INC0001234`, `CHG`, `INC004...` → direct record navigation
- **Live API results** — searches the actual SN tables as you type (400ms debounce)
- **Global text search fallback** — "Search everywhere" across all tables
- **Usage learning** — most-used modules bubble up in the quick-access chips
- **CMDB CI search** — searches configuration items by name, IP, class
- **User/email/IP detection** — automatically routes to the right search

## ServiceNow Records

| Artifact | Table | sys_id | Purpose |
|---|---|---|---|
| `smart_navigator` | `sys_ui_page` | `58acb83dcf7bba948ace75c42d851c27` | HTML/CSS/JS page |
| `smart_navigator` | `sys_processor` | `e1135575cff7fa948ace75c42d851cda` | Serves page at `/smart_navigator_v2.do` |
| `Smart Navigator` | `sys_app_module` | `8dbcb47dcf7bba948ace75c42d851c0c` | Left nav menu item |
| `SmartNavigatorLauncher` | `sys_ui_script` | `dd19eef5933fbad430d2f7e03603d68c` | Floating button (Classic UI only) |

**Instance:** `zurichandres.service-now.com`

## Files

```
servicenow/
  sys_ui_page__smart_navigator.html        ← Main page (deploy to sys_ui_page.html)
  sys_processor__smart_navigator_v2.js     ← Processor script
  sys_ui_script__SmartNavigatorLauncher.js ← Floating button (Classic UI)
bookmarklet__smart_navigator_launcher.js   ← Floating panel for Next Experience
```

## Accessing Smart Navigator

### Via Navigation
Left nav panel → Smart Navigator (appears in your application menu)

### Direct URL
`https://zurichandres.service-now.com/smart_navigator_v2.do`

### Floating Panel (Next Experience)
`sys_ui_script` does **not** execute in NE (Polaris UXF bypasses classic script loading).
Use the **bookmarklet** instead:

1. Create a bookmark in Chrome/Edge
2. Name: `⚡ Smart Nav`
3. URL: copy the `javascript:` line from `bookmarklet__smart_navigator_launcher.js`
4. Click once after loading SN — the ⚡ button appears for the whole browser session
5. `Alt+S` toggles the panel after injection

## Architecture Notes

- NE (Next Experience / Polaris) does not render `sys_ui_page` records directly — hence the `sys_processor` wrapper
- Navigation uses `<a target="_top">` programmatic click to break out of iframe context
- Usage tracking stored in `localStorage` key `sn_snav_v4`
- Module array structure: `[id, name, category, url, type, keywords, base_rank]`
  - `m[5]` = keywords (not `m[6]` which is base_rank — this was a critical bug fix)
