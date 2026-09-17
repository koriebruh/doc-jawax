import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";

const links = [
	{ href: "/#not-a-platform", label: "Product" },
	{ href: "/#offerings", label: "Offerings" },
	{ href: "/docs", label: "Docs" },
	{ href: "/#faq", label: "FAQ" },
];

export default function MobileNav() {
	return (
		<Sheet>
			<SheetTrigger
				render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}
			>
				<Menu className="h-5 w-5" />
			</SheetTrigger>
			<SheetContent side="right" className="w-72">
				<SheetHeader>
					<SheetTitle className="font-mono">jawax</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-4">
					{links.map((link) => (
						<SheetClose
							key={link.href}
							render={
								<a
									href={link.href}
									className="rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
								/>
							}
						>
							{link.label}
						</SheetClose>
					))}
				</nav>
				<div className="mt-4 flex flex-col gap-2 px-4">
					<SheetClose
						render={<Button variant="outline" render={<a href="/docs/quickstart-self-host" />} />}
					>
						Quickstart
					</SheetClose>
					<SheetClose render={<Button render={<a href="/#offerings" />} />}>Talk to us</SheetClose>
				</div>
			</SheetContent>
		</Sheet>
	);
}
