import { motion } from "motion/react";

const nodes = [
	{ label: "RTMP", group: "in" },
	{ label: "WHIP", group: "in" },
	{ label: "TRANSCODE", group: "core" },
	{ label: "HLS / LL-HLS", group: "out" },
	{ label: "WHEP", group: "out" },
];

export default function SignalPath() {
	return (
		<div className="glow-ring rounded-md border border-border bg-card/40 p-6 font-mono">
			<div className="mb-5 flex items-center justify-between">
				<span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
					Signal path
				</span>
				<span className="flex items-center gap-2 text-xs text-muted-foreground">
					<motion.span
						className="h-2 w-2 rounded-full bg-live"
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
					/>
					LIVE
				</span>
			</div>
			<div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
				{nodes.map((node, i) => (
					<div key={node.label} className="flex items-center gap-3">
						<motion.div
							className={
								"rounded border px-3 py-2 whitespace-nowrap " +
								(node.group === "core"
									? "border-primary/60 text-primary"
									: "border-border text-foreground")
							}
							initial={{ opacity: 0.35 }}
							animate={{ opacity: [0.35, 1, 0.35] }}
							transition={{
								duration: 2.4,
								repeat: Infinity,
								delay: i * 0.4,
								ease: "easeInOut",
							}}
						>
							{node.label}
						</motion.div>
						{i < nodes.length - 1 ? (
							<span className="hidden text-muted-foreground sm:inline">&rarr;</span>
						) : null}
					</div>
				))}
			</div>
		</div>
	);
}
