import { Player } from "@remotion/player";
import { PromoComposition } from "@/remotion/PromoComposition";

export default function PromoPlayer() {
	return (
		<Player
			component={PromoComposition}
			durationInFrames={570}
			fps={30}
			compositionWidth={1920}
			compositionHeight={1080}
			style={{ width: "100%", borderRadius: 10, border: "1px solid rgba(242,244,245,0.1)" }}
			controls
			loop
			clickToPlay
		/>
	);
}
