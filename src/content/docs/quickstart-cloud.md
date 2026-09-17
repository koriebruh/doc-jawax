---
title: "Quickstart: cloud managed"
description: Get an API key and start calling Jawax without running any infrastructure.
order: 2
---

On the cloud-managed tier, we operate both planes for you: a control-plane
host running `jawax_api`, and a separate media-node host running ingest,
transcode, and the SFU. You never touch Docker Compose or Postgres.

## 1. Talk to us

There's no self-service signup yet on this tier either — [contact us](mailto:hello@jawax.io)
and we'll provision an organization and your first API key.

## 2. Create a channel

```bash
curl -X POST https://api.jawax.io/v1/channels \
  -H "Authorization: Bearer jwx_live_..." \
  -H "Content-Type: application/json" \
  -d '{"name": "main-stage"}'
```

The response gives you an `rtmp_url` and a `whip_url` on our ingest host —
point your encoder or WHIP publisher at either one.

## 3. Play it back

Playback is HLS/LL-HLS off the media node, or WHEP for sub-second latency.
See the [API reference](/docs/api-reference#ingest) for both URL shapes.

## 4. Wire up webhooks

Subscribe to `stream.started`, `stream.ended`, `stream.interrupted`, and
`recording.ready` so your product reacts to stream lifecycle events instead
of polling. See [Webhooks](/docs/api-reference#webhooks).

## Billing

Cloud usage is metered — ingest minutes are tracked per organization and
billed through Stripe. Check `GET /v1/usage` any time for the current
calendar month's figures.

## What you're not getting (yet)

No customer dashboard — the API is the product surface. No self-service
signup. No team accounts — one flat set of API keys per organization. See the
[API reference's honesty section](/docs/api-reference#whats-not-in-this-api-yet)
for the full list.
