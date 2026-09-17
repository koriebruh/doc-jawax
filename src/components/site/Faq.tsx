import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
	{
		q: "Is Jawax actually open source?",
		a: "The self-host build is licensed under AGPL-3.0. You run it yourself with a license key; the key gates support and cloud features, not the ability to read or modify the source.",
	},
	{
		q: "Is there a customer dashboard?",
		a: "Not yet. Jawax is API-first — channels, keys, webhooks, and usage are all managed over REST. The admin UIs in the repo (LiveDashboard, Oban Web) are internal ops tooling, not a product surface.",
	},
	{
		q: "Can I sign up and get an API key myself?",
		a: "Not today. There's no self-service signup — provisioning is manual on both the self-host and cloud paths. Talk to us and we'll get you a key.",
	},
	{
		q: "Do you support SRT or DRM?",
		a: "No. Ingest is RTMP and WHIP, playback is HLS/LL-HLS and WHEP. SRT and DRM are on the v2 roadmap, not built.",
	},
	{
		q: "What happens if the license check fails on self-host?",
		a: "Nothing, for a week. Licensing fails open with a 7-day grace period — a network blip never interrupts a stream that's already live. After the grace period, only new channel creation is blocked.",
	},
	{
		q: "Is there team access / RBAC?",
		a: "Not yet. It's one flat set of API keys per organization today, all with equal access.",
	},
];

export default function Faq() {
	return (
		<Accordion type="single" collapsible className="reveal-cascade-up w-full" data-reveal>
			{faqs.map((item, i) => (
				<AccordionItem key={item.q} value={`item-${i}`}>
					<AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
					<AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
