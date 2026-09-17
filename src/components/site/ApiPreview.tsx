import { motion } from "motion/react";

const responseLines = [
	{ key: '"id"', value: '"ch_8f2a1c"' },
	{ key: '"status"', value: '"idle"' },
	{ key: '"rtmp_url"', value: '"rtmp://ingest.jawax.io/live/sk_live_…"' },
	{ key: '"whip_url"', value: '"https://ingest.jawax.io/whip/sk_live_…"' },
];

export default function ApiPreview() {
	return (
		<div className="glow-ring overflow-hidden rounded-lg border border-border bg-[#0a0a0b] font-mono text-sm">
			<div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
				<span className="h-2 w-2 rounded-full bg-white/15" />
				<span className="h-2 w-2 rounded-full bg-white/15" />
				<span className="h-2 w-2 rounded-full bg-white/15" />
				<span className="ml-2 text-xs text-muted-foreground">POST /v1/channels</span>
			</div>
			<div className="p-5">
				<p>
					<span className="text-primary">POST</span>{" "}
					<span className="text-foreground">/v1/channels</span>
				</p>
				<p className="mt-1 text-muted-foreground">{"{ \"name\": \"main-stage\" }"}</p>

				<motion.p
					className="mt-4 text-delivery"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.4 }}
				>
					201 Created
				</motion.p>
				<div className="mt-1">
					<span className="text-muted-foreground">{"{"}</span>
					{responseLines.map((line, i) => (
						<motion.p
							key={line.key}
							className="pl-4"
							initial={{ opacity: 0, x: -6 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.7 + i * 0.15, duration: 0.35 }}
						>
							<span className="text-foreground">{line.key}</span>
							<span className="text-muted-foreground">: </span>
							<span className="text-primary">{line.value}</span>
							<span className="text-muted-foreground">,</span>
						</motion.p>
					))}
					<span className="text-muted-foreground">{"}"}</span>
				</div>
			</div>
		</div>
	);
}
