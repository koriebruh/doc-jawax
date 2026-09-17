import {
	AbsoluteFill,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Easing,
} from "remotion";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

const INK = "#0a0c0e";
const PAPER = "#f2f4f5";
const AMBER = "#f2a93c";
const MUTED = "#5b6470";
const LIVE = "#ff3b3b";

const sans = "'Geist Variable', sans-serif";
const mono = "'Geist Mono Variable', ui-monospace, monospace";

function LiveDot() {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const pulse = Math.abs(Math.sin((frame / fps) * Math.PI * 1.4));
	return (
		<div
			style={{
				position: "absolute",
				top: 56,
				right: 64,
				display: "flex",
				alignItems: "center",
				gap: 12,
				fontFamily: mono,
				fontSize: 22,
				letterSpacing: 2,
				color: MUTED,
			}}
		>
			<div
				style={{
					width: 14,
					height: 14,
					borderRadius: 999,
					backgroundColor: LIVE,
					opacity: 0.55 + pulse * 0.45,
					boxShadow: `0 0 ${8 + pulse * 10}px ${LIVE}`,
				}}
			/>
			LIVE
		</div>
	);
}

function Node({
	label,
	sub,
	delay,
	accent = false,
}: {
	label: string;
	sub?: string;
	delay: number;
	accent?: boolean;
}) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
	return (
		<div
			style={{
				opacity: progress,
				transform: `translateY(${(1 - progress) * 16}px)`,
				border: `1px solid ${accent ? AMBER : "rgba(242,244,245,0.16)"}`,
				borderRadius: 10,
				padding: "20px 28px",
				minWidth: 220,
				textAlign: "center",
				backgroundColor: "rgba(255,255,255,0.02)",
			}}
		>
			<div style={{ fontFamily: mono, fontSize: 26, color: accent ? AMBER : PAPER, letterSpacing: 1 }}>
				{label}
			</div>
			{sub ? (
				<div style={{ fontFamily: sans, fontSize: 16, color: MUTED, marginTop: 6 }}>{sub}</div>
			) : null}
		</div>
	);
}

function Arrow({ delay }: { delay: number }) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
	return (
		<div
			style={{
				width: 64 * progress,
				height: 1,
				backgroundColor: MUTED,
				alignSelf: "center",
				overflow: "hidden",
			}}
		/>
	);
}

function Wordmark({ scale = 1 }: { scale?: number }) {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 14 * scale,
				fontFamily: mono,
				fontSize: 40 * scale,
				color: PAPER,
				letterSpacing: 1,
			}}
		>
			<div
				style={{
					width: 14 * scale,
					height: 14 * scale,
					borderRadius: 999,
					backgroundColor: AMBER,
				}}
			/>
			jawax
		</div>
	);
}

function SceneTitle() {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const mark = spring({ frame, fps, config: { damping: 200 } });
	const tagline = interpolate(frame, [18, 40], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.quad),
	});
	return (
		<AbsoluteFill style={{ backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
			<div style={{ opacity: mark, transform: `scale(${0.9 + mark * 0.1})` }}>
				<Wordmark scale={2.4} />
			</div>
			<div
				style={{
					opacity: tagline,
					transform: `translateY(${(1 - tagline) * 10}px)`,
					fontFamily: sans,
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

function SceneSignalPath() {
	return (
		<AbsoluteFill style={{ backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
			<LiveDot />
			<div
				style={{
					fontFamily: mono,
					fontSize: 18,
					color: MUTED,
					letterSpacing: 3,
					textTransform: "uppercase",
					marginBottom: 44,
				}}
			>
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

function FactLine({ text, delay }: { text: string; delay: number }) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
	return (
		<div
			style={{
				opacity: progress,
				transform: `translateX(${(1 - progress) * -24}px)`,
				display: "flex",
				alignItems: "center",
				gap: 18,
				fontFamily: sans,
				fontSize: 30,
				color: PAPER,
			}}
		>
			<span style={{ color: AMBER, fontFamily: mono }}>&gt;</span>
			{text}
		</div>
	);
}

function SceneFacts() {
	return (
		<AbsoluteFill style={{ backgroundColor: INK, justifyContent: "center", paddingLeft: 160 }}>
			<LiveDot />
			<div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
				<FactLine text="Per-channel process isolation — OTP" delay={0} />
				<FactLine text="Control plane and media plane, split apart" delay={18} />
				<FactLine text="Self-host license fails open, never bricks a live stream" delay={36} />
			</div>
		</AbsoluteFill>
	);
}

function OfferingChip({ label, note, delay, dim = false }: { label: string; note: string; delay: number; dim?: boolean }) {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const progress = spring({ frame: frame - delay, fps, config: { damping: 200 } });
	return (
		<div
			style={{
				opacity: progress * (dim ? 0.55 : 1),
				transform: `translateY(${(1 - progress) * 16}px)`,
				border: `1px solid ${dim ? "rgba(242,244,245,0.12)" : "rgba(242,169,60,0.5)"}`,
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
		<AbsoluteFill style={{ backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
			<div style={{ display: "flex", gap: 20 }}>
				<OfferingChip label="Open source" note="Self-host, AGPL-3.0" delay={0} />
				<OfferingChip label="Cloud managed" note="We run the media plane" delay={8} />
				<OfferingChip label="Bare metal" note="Coming soon" delay={16} dim />
			</div>
		</AbsoluteFill>
	);
}

function SceneEnd() {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const progress = spring({ frame, fps, config: { damping: 200 } });
	return (
		<AbsoluteFill style={{ backgroundColor: INK, alignItems: "center", justifyContent: "center" }}>
			<div style={{ opacity: progress }}>
				<Wordmark scale={1.8} />
			</div>
			<div
				style={{
					opacity: progress,
					fontFamily: mono,
					fontSize: 18,
					color: AMBER,
					marginTop: 20,
					letterSpacing: 1,
				}}
			>
				Read the docs &rarr;
			</div>
		</AbsoluteFill>
	);
}

export function PromoComposition() {
	return (
		<AbsoluteFill style={{ backgroundColor: INK }}>
			<Sequence durationInFrames={60}>
				<SceneTitle />
			</Sequence>
			<Sequence from={60} durationInFrames={140}>
				<SceneSignalPath />
			</Sequence>
			<Sequence from={200} durationInFrames={90}>
				<SceneFacts />
			</Sequence>
			<Sequence from={290} durationInFrames={70}>
				<SceneOfferings />
			</Sequence>
			<Sequence from={360} durationInFrames={60}>
				<SceneEnd />
			</Sequence>
		</AbsoluteFill>
	);
}
