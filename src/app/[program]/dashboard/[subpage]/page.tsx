// app/[program]/dashboard/[subpage]/page.tsx

import { notFound } from 'next/navigation';
import { PROGRAMS, NAV_DATA } from '@/lib/data/nav-data';

export default function ProgramDashboardSubpage({
	params,
}: {
	params: { program: string; subpage: string };
}) {
	const { program, subpage } = params;

	// 1) Check if the program is valid:
	const foundProgram = PROGRAMS.find((p) => p.slug === program);
	if (!foundProgram) {
		notFound();
	}

	// 2) Check if this subpage belongs to that program’s nav data:
	const subLinks = NAV_DATA[foundProgram!.name]?.[0]?.items || [];
	const isValidSubpage = subLinks.some((item) => item.url === subpage);
	if (!isValidSubpage) {
		notFound();
	}

	// 3) Render your content conditionally:
	if (program === 'home') {
		switch (subpage) {
			case 'tools':
				return <div>Tools UI for Home</div>;
			case 'about':
				return <div>About UI for Home</div>;
			default:
				notFound();
		}
	} else if (program === 'ai-bridge') {
		switch (subpage) {
			case 'agents':
				return <div>Agents UI for AI Bridge</div>;
			case 'monitor':
				return <div>Monitor UI for AI Bridge</div>;
			case 'prompt-engine':
				return <div>Prompt Engine UI for AI Bridge</div>;
			case 'memory':
				return <div>Memory UI for AI Bridge</div>;
			default:
				notFound();
		}
	} else if (program === 'pomodoro-timer') {
		switch (subpage) {
			case 'sessions':
				return <div>Sessions UI for Pomodoro</div>;
			default:
				notFound();
		}
	} else if (program === 'github-diagrams') {
		switch (subpage) {
			case'integrator':
				return <div>Integrator UI for Github Diagrams</div>;
			default:
				notFound();
		}
	}

	// If we got here somehow, just 404
	notFound();
}
