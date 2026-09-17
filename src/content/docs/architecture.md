---
title: Architecture
description: How the control plane, media plane, and SFU fit together — and what happens when something crashes.
order: 3
---

Jawax is an Elixir umbrella with a Go module bolted on for WebRTC. Four Mix
apps, two release artifacts, one Go binary.

## Apps

| App | Ships in | Responsibility |
|---|---|---|
| `jawax_api` | `jawax_api` release | Phoenix REST API, owns Postgres: orgs, channels, keys, webhooks, usage. Oban jobs, LiveDashboard/Oban Web (internal ops only). |
| `jawax_ingest` | `jawax_media_node` release | RTMP listener, stream-key auth against a local ETS cache — no DB hit per connect. |
| `jawax_transcode` | `jawax_media_node` release | Membrane + FFmpeg ABR transcode, HLS/LL-HLS packaging, admission control, the gRPC server the Go SFU calls into, S3-compatible upload for recordings. |
| `jawax_shared` | both | Shared Ecto schemas, webhook delivery + SSRF-safe URL validation, licensing/grace-period logic, Oban workers. |
| `jawax_sfu` (Go) | its own process | Pion-based WHIP (publish) and WHEP (playback) HTTP endpoints. |

`jawax_ingest` and `jawax_transcode` ship together as `jawax_media_node`,
sharing a container network namespace with `jawax_sfu`
(`network_mode: service:media_node`) so `127.0.0.1` RTP handoff between the
two actually works.

## Control plane vs. media plane

This split is deliberate, not incidental: `jawax_api` (control, Postgres)
deploys as a separate host from the media node (ingest, transcode, SFU). The
media node checks stream keys against a **local ETS cache**, so it keeps
serving streams that are already live even if the control plane is briefly
unreachable — a control-plane blip degrades new-stream provisioning, not
existing viewers.

## How media actually moves

Control signaling and media never share a transport:

- **gRPC** — `jawax_sfu` calls `jawax_transcode`'s `ValidatePublish` and
  `PreparePlayback` RPCs for control decisions.
- **Raw RTP over localhost UDP** — the actual media packets, never
  serialized through gRPC/protobuf.

Ingest is RTMP (Membrane) or WHIP (Go + Pion — the same WebRTC library
underlying LiveKit and most production open-source SFUs). Output is ABR HLS
with real LL-HLS partial segments, or WHEP for WebRTC playback.

## Resilience

- **Per-channel process isolation.** OTP supervision restarts a crashed
  ingest/transcode pipeline without touching any other live channel on the
  same node.
- **Drain before deploy.** New connections stop, a 30-second grace window
  runs, then the node restarts — implemented in `infra/deploy.sh` and the Go
  SFU's SIGTERM-triggered draining middleware.
- **Admission control.** A hard cap on concurrent channels per node (default
  15) stops overload from cascading into already-live streams. This number
  is an explicit, unverified starting guess, not a load-tested ceiling.
- **No Redis.** Oban (Postgres-backed) for durable jobs, Phoenix PubSub for
  ephemeral coordination like stream-key cache invalidation.

## What's not built yet

Worth knowing before you plan capacity around it: there's no `libcluster`
dependency anywhere, so each release runs single-node today, despite
clustering being discussed as a rationale for choosing PubSub. Kubernetes
support and horizontal media-node scaling are both v2-roadmap items. Postgres
runs as a single instance with nightly `pg_dump` backups — no HA, no
WAL-based point-in-time recovery yet.
