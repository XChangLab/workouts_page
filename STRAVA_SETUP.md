# Strava Segment Sync

The client app has **no Strava API token** — segment details are pre-fetched by a sync
script and stored in `public/data/segments-data.json`. Credentials never reach the browser.

---

## How it works

```
segments.json          →  sync script  →  segments-data.json  →  app reads this
(hand-maintained URLs)    (server-side)    (committed to repo)
```

1. You maintain `public/data/segments.json` — Strava segment URLs grouped by country.
2. The sync script exchanges your OAuth2 credentials for a fresh access token, fetches
   full segment details, and writes `segments-data.json`.
3. The app serves `segments-data.json` as a static file — no runtime API calls.

---

## One-time credential setup

### 1. Create a Strava API application

1. Go to https://www.strava.com/settings/api
2. Create an application (any name/website — only used for API access).
3. Note your **Client ID** and **Client Secret**.

### 2. Obtain a refresh token (read scope)

Run this URL in your browser (replace `YOUR_CLIENT_ID`):

```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&scope=read&approval_prompt=force
```

After authorising, copy the `code` parameter from the redirect URL, then exchange it:

```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=YOUR_CODE \
  -d grant_type=authorization_code
```

Copy the `refresh_token` from the response. This token does not expire unless revoked.

---

## Running the sync script locally

```bash
STRAVA_CLIENT_ID=your_client_id \
STRAVA_CLIENT_SECRET=your_client_secret \
STRAVA_REFRESH_TOKEN=your_refresh_token \
npm run sync
```

The script automatically fetches a fresh access token before calling the segments API —
no manual token regeneration needed.

---

## Running via GitHub Actions (recommended)

Store the three values as repository secrets:

1. In your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add three secrets:
   - `STRAVA_CLIENT_ID`
   - `STRAVA_CLIENT_SECRET`
   - `STRAVA_REFRESH_TOKEN`

Then trigger the workflow:

- **Actions → Sync Strava Segments → Run workflow**
- Toggle **Dry run** to preview without committing, or leave it off to commit the result.

The workflow commits the updated `segments-data.json` back to the main branch automatically.

### Refresh token rotation

Strava rotates the refresh token on each exchange. If the script logs a new refresh token,
update the `STRAVA_REFRESH_TOKEN` secret in GitHub with the new value. The old token
remains valid briefly, so this is not urgent.

---

## Adding segments

Edit `public/data/segments.json` — append a Strava segment URL to the correct country array:

```json
{
  "FR": [
    "https://www.strava.com/segments/229781",
    "https://www.strava.com/segments/668877"
  ]
}
```

Then run the sync script or trigger the GitHub Actions workflow to fetch the new details.
