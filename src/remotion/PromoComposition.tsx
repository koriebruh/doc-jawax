import {
	AbsoluteFill,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from "remotion";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/geist-mono";

const INK = "#121214";
const PAPER = "#f7f7f8";
const PRIMARY = "#f97316";
const GOLD = "#f97316";
const BLUE = "#3b82f6";
const MUTED = "#9a9a9f";
const LIVE = "#ef4444";

const sans = "'Plus Jakarta Sans Variable', sans-serif";
const mono = "'Geist Mono Variable', ui-monospace, monospace";

function useSpringIn(delay: number, config: Parameters<typeof spring>[0]["config"] = { damping: 200 }) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	return spring({ frame: frame - delay, fps, config });
}

function Backdrop() {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: INK,
				backgroundImage: `radial-gradient(circle at 14% 12%, ${hexA(PRIMARY, 0.14)}, transparent 42%), radial-gradient(circle at 86% 78%, ${hexA(BLUE, 0.12)}, transparent 46%)`,
			}}
		/>
	);
}

function hexA(hex: string, alpha: number) {
	const n = parseInt(hex.slice(1), 16);
	const r = (n >> 16) & 255;
	const g = (n >> 8) & 255;
	const b = n & 255;
	return `rgba(${r},${g},${b},${alpha})`;
}

function Scanlines() {
	const frame = useCurrentFrame();
	const offset = (frame * 1.4) % 6;
	return (
		<AbsoluteFill
			style={{
				pointerEvents: "none",
				mixBlendMode: "overlay",
				backgroundImage:
					"repeating-linear-gradient(to bottom, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)",
				backgroundPositionY: `${offset}px`,
			}}
		/>
	);
}

function LiveBadge({ style }: { style?: React.CSSProperties }) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const pulse = Math.abs(Math.sin((frame / fps) * Math.PI * 1.4));
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: mono, fontSize: 18, letterSpacing: 2, color: MUTED, ...style }}>
			<div
				style={{
					width: 12,
					height: 12,
					borderRadius: 999,
					backgroundColor: LIVE,
					opacity: 0.55 + pulse * 0.45,
					boxShadow: `0 0 ${6 + pulse * 8}px ${LIVE}`,
				}}
			/>
			LIVE
		</div>
	);
}

function Wordmark({ scale = 1 }: { scale?: number }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 14 * scale, fontFamily: mono, fontSize: 40 * scale, color: PAPER, letterSpacing: 1 }}>
			<div style={{ width: 14 * scale, height: 14 * scale, borderRadius: 999, backgroundColor: PRIMARY }} />
			jawax
		</div>
	);
}

// Scene 1 — title
function SceneTitle() {
	const frame = useCurrentFrame();
	const mark = useSpringIn(0);
	const tagline = interpolate(frame, [18, 42], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.quad),
	});
	return (
		<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
			<div style={{ opacity: mark, transform: `scale(${0.92 + mark * 0.08})` }}>
				<Wordmark scale={2.4} />
			</div>
			<div
				style={{
					opacity: tagline,
					transform: `translateY(${(1 - tagline) * 10}px)`,
					fontFamily: sans,
					fontWeight: 500,
					fontSize: 24,
					color: MUTED,
					marginTop: 22,
				}}
			>
				A live-streaming engine you embed, not a platform you visit.
			</div>
		</AbsoluteFill>
	);
}

// Scene 2 — a live signal coming in
function WaveBar({ i }: { i: number }) {
	const frame = useCurrentFrame();
	const h = 6 + Math.abs(Math.sin(frame / 5 + i * 1.3)) * 22;
	return <div style={{ width: 4, height: h, borderRadius: 2, backgroundColor: GOLD, opacity: 0.8 }} />;
}

function SceneLiveSignal() {
	const frame = useCurrentFrame();
	const frameIn = useSpringIn(0);
	const sweep = interpolate(frame, [10, 55], [0, 100], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const chips = useSpringIn(60);
	return (
		<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
			<div
				style={{
					opacity: frameIn,
					transform: `scale(${0.95 + frameIn * 0.05})`,
					width: 520,
					height: 292,
					borderRadius: 10,
					border: `1px solid ${hexA(PAPER, 0.16)}`,
					position: "relative",
					overflow: "hidden",
					backgroundColor: hexA(PAPER, 0.02),
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: 0,
						background: `linear-gradient(to bottom, transparent, ${hexA(GOLD, 0.18)}, transparent)`,
						transform: `translateY(${sweep - 30}%)`,
					}}
				/>
				<LiveBadge style={{ position: "absolute", top: 16, left: 18 }} />
				<div style={{ position: "absolute", bottom: 18, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5 }}>
					{Array.from({ length: 11 }).map((_, i) => (
						<WaveBar key={i} i={i} />
					))}
				</div>
			</div>
			<div style={{ opacity: chips, marginTop: 28, display: "flex", gap: 14, fontFamily: mono, fontSize: 16, color: MUTED }}>
				<span style={{ border: `1px solid ${hexA(PAPER, 0.16)}`, borderRadius: 6, padding: "6px 14px" }}>RTMP</span>
				<span style={{ border: `1px solid ${hexA(PAPER, 0.16)}`, borderRadius: 6, padding: "6px 14px" }}>WHIP</span>
				<span style={{ alignSelf: "center" }}>incoming</span>
			</div>
		</AbsoluteFill>
	);
}

// Scene 3 — signal path
function Node({ label, sub, delay, accent = false }: { label: string; sub?: string; delay: number; accent?: boolean }) {
	const progress = useSpringIn(delay);
	return (
		<div
			style={{
				opacity: progress,
				transform: `translateY(${(1 - progress) * 16}px)`,
				border: `1px solid ${accent ? PRIMARY : hexA(PAPER, 0.16)}`,
				borderRadius: 10,
				padding: "20px 28px",
				minWidth: 220,
				textAlign: "center",
				whiteSpace: "nowrap",
				backgroundColor: hexA(PAPER, 0.02),
			}}
		>
			<div style={{ fontFamily: mono, fontSize: 26, color: accent ? PRIMARY : PAPER, letterSpacing: 1 }}>{label}</div>
			{sub ? <div style={{ fontFamily: sans, fontSize: 15, color: MUTED, marginTop: 6 }}>{sub}</div> : null}
		</div>
	);
}

function Arrow({ delay }: { delay: number }) {
	const progress = useSpringIn(delay);
	return <div style={{ width: 64 * progress, height: 1, backgroundColor: hexA(PAPER, 0.3), alignSelf: "center" }} />;
}

function SceneSignalPath() {
	return (
		<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
			<LiveBadge style={{ position: "absolute", top: 56, right: 64 }} />
			<div style={{ fontFamily: mono, fontSize: 18, color: MUTED, letterSpacing: 3, textTransform: "uppercase", marginBottom: 44 }}>
				Ingest &rarr; transcode &rarr; deliver
			</div>
			<div style={{ display: "flex", alignItems: "center" }}>
				<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
					<Node label="RTMP" delay={0} />
					<Node label="WHIP" sub="WebRTC publish" delay={6} />
				</div>
				<Arrow delay={16} />
				<Node label="TRANSCODE" sub="Elixir · Membrane · FFmpeg" delay={24} accent />
				<Arrow delay={40} />
				<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
					<Node label="HLS / LL-HLS" delay={48} />
					<Node label="WHEP" sub="WebRTC playback" delay={54} />
				</div>
			</div>
		</AbsoluteFill>
	);
}

// Scene 4 — ABR ladder
function LadderBar({ label, kbps, height, delay }: { label: string; kbps: string; height: number; delay: number }) {
	const progress = useSpringIn(delay, { damping: 16 });
	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
			<div
				style={{
					width: 70,
					height: height * progress,
					borderRadius: 6,
					background: `linear-gradient(to top, ${GOLD}, ${hexA(GOLD, 0.35)})`,
				}}
			/>
			<div style={{ fontFamily: mono, fontSize: 16, color: PAPER }}>{label}</div>
			<div style={{ fontFamily: mono, fontSize: 12, color: MUTED }}>{kbps}</div>
		</div>
	);
}

function SceneLadder() {
	return (
		<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
			<div style={{ fontFamily: mono, fontSize: 18, color: MUTED, letterSpacing: 3, textTransform: "uppercase", marginBottom: 36 }}>
				One input, an ABR ladder out
			</div>
			<div style={{ display: "flex", alignItems: "flex-end", gap: 40, height: 200 }}>
				<LadderBar label="720p" kbps="2500 kbps" height={170} delay={0} />
				<LadderBar label="480p" kbps="1200 kbps" height={120} delay={8} />
				<LadderBar label="360p" kbps="700 kbps" height={80} delay={16} />
			</div>
		</AbsoluteFill>
	);
}

// Scene 5 — control plane / media plane
function PlaneBox({ title, color, items, delay, align }: { title: string; color: string; items: string[]; delay: number; align: "left" | "right" }) {
	const progress = useSpringIn(delay);
	return (
		<div
			style={{
				opacity: progress,
				transform: `translateX(${(1 - progress) * (align === "left" ? -20 : 20)}px)`,
				border: `1px solid ${color}`,
				borderRadius: 10,
				padding: "22px 26px",
				width: 300,
				backgroundColor: hexA(color, 0.06),
			}}
		>
			<div style={{ fontFamily: mono, fontSize: 14, letterSpacing: 2, color, textTransform: "uppercase" }}>{title}</div>
			<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
				{items.map((item) => (
					<div key={item} style={{ fontFamily: sans, fontSize: 16, color: PAPER }}>
						{item}
					</div>
				))}
			</div>
		</div>
	);
}

function HeartbeatDot({ color, phase }: { color: string; phase: number }) {
	const frame = useCurrentFrame();
	const t = ((frame + phase) % 54) / 54;
	const pulse = Math.max(0, Math.sin(t * Math.PI));
	return (
		<div
			style={{
				width: 6,
				height: 6,
				borderRadius: 999,
				backgroundColor: color,
				opacity: 0.25 + pulse * 0.75,
				transform: `scale(${0.85 + pulse * 0.3})`,
			}}
		/>
	);
}

function SceneArchitecture() {
	const link = useSpringIn(20);
	return (
		<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
			<div style={{ fontFamily: sans, fontWeight: 600, fontSize: 26, color: PAPER, marginBottom: 36, textAlign: "center" }}>
				Control plane and media plane, split on purpose.
			</div>
			<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
				<PlaneBox title="Control plane" color={BLUE} items={["jawax_api", "Postgres", "Oban jobs"]} delay={0} align="left" />
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: link }}>
					<div style={{ width: 32, height: 1, backgroundColor: hexA(PAPER, 0.25) }} />
					<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
						<HeartbeatDot color={BLUE} phase={0} />
						<HeartbeatDot color={hexA(PAPER, 0.5)} phase={18} />
						<HeartbeatDot color={GOLD} phase={36} />
					</div>
					<span style={{ fontFamily: mono, fontSize: 12, color: MUTED, whiteSpace: "nowrap" }}>Postgres · heartbeat</span>
					<div style={{ width: 32, height: 1, backgroundColor: hexA(PAPER, 0.25) }} />
				</div>
				<PlaneBox title="Media plane" color={GOLD} items={["jawax_ingest", "jawax_transcode", "jawax_sfu"]} delay={10} align="right" />
			</div>
			<div style={{ marginTop: 28, fontFamily: sans, fontSize: 15, color: MUTED, opacity: link }}>
				A control-plane blip never touches a stream that's already live.
			</div>
		</AbsoluteFill>
	);
}

// Scene 6 — offerings
function OfferingChip({ label, note, delay, dim = false }: { label: string; note: string; delay: number; dim?: boolean }) {
	const progress = useSpringIn(delay);
	return (
		<div
			style={{
				opacity: progress * (dim ? 0.55 : 1),
				transform: `translateY(${(1 - progress) * 16}px)`,
				border: `1px solid ${dim ? hexA(PAPER, 0.12) : hexA(PRIMARY, 0.5)}`,
				borderRadius: 10,
				padding: "24px 30px",
				width: 280,
			}}
		>
			<div style={{ fontFamily: mono, fontSize: 22, color: dim ? MUTED : PAPER }}>{label}</div>
			<div style={{ fontFamily: sans, fontSize: 15, color: MUTED, marginTop: 8 }}>{note}</div>
		</div>
	);
}

function SceneOfferings() {
	return (
		<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
			<div style={{ display: "flex", gap: 20 }}>
				<OfferingChip label="Open source" note="Self-host, AGPL-3.0" delay={0} />
				<OfferingChip label="Cloud managed" note="We run the media plane" delay={8} />
				<OfferingChip label="Bare metal" note="Coming soon" delay={16} dim />
			</div>
		</AbsoluteFill>
	);
}

// Scene 7 — end card
function SceneEnd() {
	const progress = useSpringIn(0);
	return (
		<AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
			<div style={{ opacity: progress }}>
				<Wordmark scale={1.8} />
			</div>
			<div style={{ opacity: progress, fontFamily: mono, fontSize: 18, color: PRIMARY, marginTop: 20, letterSpacing: 1 }}>
				Read the docs &rarr;
			</div>
		</AbsoluteFill>
	);
}

export function PromoComposition() {
	return (
		<AbsoluteFill>
			<Backdrop />
			<Sequence durationInFrames={60}>
				<SceneTitle />
			</Sequence>
			<Sequence from={60} durationInFrames={100}>
				<SceneLiveSignal />
			</Sequence>
			<Sequence from={160} durationInFrames={120}>
				<SceneSignalPath />
			</Sequence>
			<Sequence from={280} durationInFrames={60}>
				<SceneLadder />
			</Sequence>
			<Sequence from={340} durationInFrames={100}>
				<SceneArchitecture />
			</Sequence>
			<Sequence from={440} durationInFrames={70}>
				<SceneOfferings />
			</Sequence>
			<Sequence from={510} durationInFrames={60}>
				<SceneEnd />
			</Sequence>
			<Scanlines />
		</AbsoluteFill>
	);
}

export const PROMO_DURATION_IN_FRAMES = 570;
