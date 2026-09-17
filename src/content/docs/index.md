---
title: Overview
description: What Jawax is, and what it deliberately doesn't do.
order: 0
---

Jawax is a live-streaming **engine**: a set of services you run (or that we run
for you) that take a stream in over RTMP or WHIP, transcode it, and serve it
back out as HLS, LL-HLS, or WHEP. It sits behind your product's API — there is
no Jawax viewer app, no chat, no discovery feed. Those are yours to build.

Think of it the way you'd think of Mux or a self-hosted Ant Media Server: an
infrastructure component, not a destination.

## The two planes

Jawax splits into a **control plane** and a **media plane**, deployed
separately:

- **Control plane** (`jawax_api`) — a Phoenix REST API backed by Postgres.
  Organizations, channels, API keys, webhooks, and usage all live here.
- **Media plane** (`jawax_ingest`, `jawax_transcode`, `jawax_sfu`) — the
  services that actually touch video: an RTMP listener and Membrane-based
  transcode pipeline in Elixir, and a Go + Pion WHIP/WHEP server for WebRTC.

The media plane keeps serving already-live streams from a local cache even if
the control plane is briefly unreachable — see [Architecture](/docs/architecture)
for why that split exists.

## Where to go next

- [Quickstart — self-host](/docs/quickstart-self-host) — run the whole engine
  yourself with Docker Compose.
- [Quickstart — cloud managed](/docs/quickstart-cloud) — get a key and call
  the API, we run the media plane.
- [Architecture](/docs/architecture) — how the pieces fit together and what
  happens when something crashes.
- [API reference](/docs/api-reference) — every endpoint, every error shape.

## Honesty check

Jawax is early — version `0.1.0`. There's no self-service signup on either
deployment path yet, no customer dashboard (the API is the product), and no
SRT or DRM. The [API reference](/docs/api-reference#whats-not-in-this-api-yet)
keeps an explicit list of what isn't built yet — read it before you plan
around something that doesn't exist.
