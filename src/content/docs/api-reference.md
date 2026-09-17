---
title: API reference
description: Every endpoint on the control-plane API, straight from the source.
order: 4
---

Everything below is `GET`/`POST`/`PATCH`/`DELETE` JSON over HTTP — no
websockets, no GraphQL.

- **Base URL**: `https://api.jawax.io` on cloud, `http://localhost:4000` by
  default on self-host.
- All `/v1/*` routes require auth. `/healthz` and `/readyz` are public.

## Authentication

Every `/v1/*` request needs a bearer API key:

```
Authorization: Bearer jwx_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

A missing, invalid, or revoked key returns `401 {"error": "unauthorized"}`.

**Getting your first key isn't self-service.** An operator provisions your
organization's first key out-of-band. Once you have one, manage the rest
yourself — see [API keys](#api-keys).

## Rate limiting

300 requests/minute per organization. Over the limit:

```
429 Too Many Requests
{"error": "rate_limited", "retry_after_ms": 60000}
```

This number is a conservative, untuned starting value, not a validated
ceiling.

## Errors

| Status | Shape | When |
|---|---|---|
| `404` | `{"error": "not_found"}` | resource doesn't exist, or belongs to another org |
| `422` | `{"error": "invalid", "details": {"field": ["message"]}}` | validation failure |
| `422` | `{"error": "last_api_key", "message": "..."}` | tried to revoke an org's last remaining key |
| `402` | `{"error": "license_grace_period_expired", "message": "..."}` | self-host heartbeat failed for 7+ days — blocks new channel creation only |

## Channels

A channel is a persistent ingest/playback endpoint with its own stream key.
`status` is `"idle"` or `"live"`, tracked automatically by the ingest
pipeline.

```
POST /v1/channels
{"name": "main-stage", "abr_profile": {}}
```

`201`:

```json
{
  "id": "…", "name": "main-stage", "status": "idle",
  "stream_key": "sk_live_…",
  "rtmp_url": "rtmp://ingest.example.com/live/sk_live_…",
  "whip_url": "https://ingest.example.com/whip/sk_live_…"
}
```

`stream_key` is shown **exactly once** — it's stored as a one-way hash. Lost
it? Rotate it:

```
POST /v1/channels/:channel_id/stream_key/rotate
```

Other channel routes:

```
GET    /v1/channels
GET    /v1/channels/:id
PATCH  /v1/channels/:id   {"name": "renamed", "abr_profile": {...}}
DELETE /v1/channels/:id
```

`PATCH` only accepts `name` and `abr_profile` — `status` and the stream key
have their own flows and are silently ignored in this body.

### `abr_profile`

```json
{ "renditions": ["720p", "480p"], "dvr_window_seconds": 120 }
```

- `renditions` restricts the default ladder (`720p` 2500kbps, `480p`
  1200kbps, `360p` 700kbps). Omit for all three.
- `dvr_window_seconds` clamps to 30–3600, defaults to 30.

### Playback token

```
GET /v1/channels/:channel_id/playback_token
```

Returns a 60-second HS256 JWT. Enforcing it at your CDN/edge is your call —
this API issues and can verify the token, but doesn't fix a URL/query-param
convention for you.

### Recordings

```
GET /v1/channels/:channel_id/recordings
```

Returns `status` (`processing`/`ready`/`failed`), `duration_sec`, and
`r2_path`. **Known gap:** `r2_path` is a raw bucket path, not a fetchable or
signed URL yet — treat it as "here's where it lives," not "here's a link."

## Ingest

- **RTMP**: `rtmp://<host>/live/<stream_key>`
- **WHIP**: `https://<host>/whip/<stream_key>` — terminated by `jawax_sfu`

Either way, output is ABR HLS with real LL-HLS (sub-second parts).

## Playback

- **HLS**: `GET https://<media-node-host>/hls/{channel_id}/index.m3u8`, plus
  a periodically refreshed preview at `/hls/{channel_id}/thumbnail.jpg`.
- **WHEP**: via `jawax_sfu` — ask your integration contact for the exact
  endpoint convention.

## Webhooks

```
POST   /v1/webhooks   {"url": "https://you.example.com/hooks", "subscribed_events": ["stream.started", "stream.ended"]}
GET    /v1/webhooks
DELETE /v1/webhooks/:id
GET    /v1/webhooks/:webhook_id/deliveries
```

Target URLs are validated against SSRF — no internal/private-network
targets.

**Events**: `stream.started`, `stream.ended`, `stream.interrupted` (crash or
node loss — mutually exclusive with `stream.ended`), `recording.ready`.

**Signature**: header `x-jawax-signature` is a lowercase-hex HMAC-SHA256 of
the exact raw JSON body, keyed with the webhook's `secret` (shown once, at
creation). Verify before trusting the payload. Delivery retries up to 8
times on a non-2xx response or network error.

## API keys

```
POST   /v1/api_keys   {"name": "ci-runner"}
GET    /v1/api_keys
DELETE /v1/api_keys/:id
```

`POST` returns the plaintext key once. `DELETE` revokes immediately and
**refuses to revoke your organization's last remaining key** — there's no
self-service way to create a first one, so that would lock you out for good.

## Usage

```
GET /v1/usage
```

Returns the current calendar month, e.g. `{"ingest_minutes": "123.45"}` —
decimal strings, not floats, to keep billing precise.

## What's not in this API yet

- No self-service org signup or first-key issuance.
- No downloadable or signed recording playback URL.
- No SRT ingest, DASH output, or DRM.
- No team/RBAC — one flat set of API keys per organization, all with equal
  access.
