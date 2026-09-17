---
title: "Quickstart: self-host"
description: Run the full Jawax engine on your own infrastructure with Docker Compose.
order: 1
---

Self-hosting runs Postgres, the control-plane API, and the media node
(ingest + transcode + SFU) together, on one host, from the project's
`docker-compose.yml`.

## 1. Get a license key

Self-host is licensed under **AGPL-3.0** and gated by a license key plus a
periodic heartbeat. Contact us for a key before you start — there's no
self-service issuance yet.

## 2. Configure environment

Copy `.env.example` to `.env` and fill in the required values:

```bash
POSTGRES_USER=jawax
POSTGRES_PASSWORD=change-me
POSTGRES_DB=jawax

# mix phx.gen.secret
SECRET_KEY_BASE=

# must be non-empty — the app refuses to boot with a blank value
DASHBOARD_PASSWORD=

# S3-compatible object storage — MinIO, Cloudflare R2, or AWS S3, no code
# change needed between them
STORAGE_ENDPOINT_HOST=minio
STORAGE_ENDPOINT_PORT=9000
STORAGE_SCHEME=http://
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
STORAGE_BUCKET=jawax-recordings

JAWAX_DEPLOYMENT_MODE=self_host
JAWAX_LICENSE_KEY=
```

Keep every value on its own line — Docker's `--env-file` parser takes
everything after `=` literally, including a trailing `# comment`.

No object storage handy yet? Bring up `docker-compose.minio.yml` alongside
the main file for a local MinIO instance.

## 3. Bring it up

```bash
docker compose up -d
```

This starts three services:

- `postgres` — state for the control plane.
- `api` — the control-plane REST API, on port `4000`.
- `media_node` — RTMP (`1935`), the HLS origin (`8080`), and WHIP/WHEP
  (`8081`/`8082`) via the co-located `jawax_sfu` process, which shares
  `media_node`'s network namespace so the two can hand off raw RTP over
  `127.0.0.1`.

## 4. Provision your first organization and API key

There's no signup flow yet — run the seed script on the host:

```bash
mix run apps/jawax_shared/priv/repo/seeds.exs
```

This gives you an organization and a bearer key
(`Authorization: Bearer jwx_live_...`) to use against the API — see the
[API reference](/docs/api-reference).

## 5. Create a channel and go live

```bash
curl -X POST http://localhost:4000/v1/channels \
  -H "Authorization: Bearer jwx_live_..." \
  -H "Content-Type: application/json" \
  -d '{"name": "main-stage"}'
```

The response includes `rtmp_url` and `whip_url` — point OBS (RTMP) or a WHIP
publisher at one of them, and the channel flips to `"live"` automatically.
Playback is HLS at `/hls/{channel_id}/index.m3u8` off the media node.

## What the license key actually gates

The heartbeat check **fails open**: if it can't reach the control plane for
up to 7 days, nothing happens to already-live streams. After 7 days without a
successful heartbeat, only *new* channel creation is blocked
(`402 license_grace_period_expired`) — a network blip never takes down a
stream that's already running.
