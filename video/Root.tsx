import { Composition } from "remotion";
import { PromoComposition } from "../src/remotion/PromoComposition";

export const RemotionRoot = () => {
	return (
		<Composition
			id="PromoVideo"
			component={PromoComposition}
			durationInFrames={570}
			fps={30}
			width={1920}
			height={1080}
		/>
	);
};
