// app-sidebar.tsx

'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/shadcn/sidebar';

import { Nav } from '@/components/blocks/sidebar/content/nav';
import { ProgramSwitcher } from '@/components/blocks/sidebar/header/program-switcher';
import {
	PROGRAMS,
	NAV_DATA,
	getDefaultRouteForProgram,
} from '@/lib/data/nav-data';
import { SettingsDialog } from './footer/settings-dialog';

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const router = useRouter();
	const pathname = usePathname() || '';
	const segments = pathname.split('/').filter(Boolean);

	// 1) The first segment in the path is our active program slug
	//    If there's no segment, fallback to 'home'
	const activeSlug = segments[0] ?? 'home';

	// 2) Find that program object from your "PROGRAMS" array
	//    If not found, fallback to the first or to 'home'
	const foundProgram =
		PROGRAMS.find((p) => p.slug === activeSlug) || PROGRAMS[0];

	// 3) We'll grab the nav items from navData using foundProgram
	const navItems = NAV_DATA[foundProgram.name] || [];

	// 4) If the user picks a program from ProgramSwitcher, we navigate
	//    to that program’s default sub-route
	const handleProgramChange = React.useCallback(
		(prog: (typeof PROGRAMS)[number]) => {
			const defaultRoute = getDefaultRouteForProgram(prog.slug);
			router.push(defaultRoute);
		},
		[router]
	);

	return (
		<Sidebar
			collapsible='icon'
			{...props}
		>
			<SidebarHeader>
				<ProgramSwitcher
					programs={PROGRAMS}
					activeProgram={foundProgram}
					onProgramChange={handleProgramChange}
				/>
			</SidebarHeader>
			<SidebarContent>
				<Nav
					baseSlug={foundProgram.slug}
					items={navItems}
					currentPath={pathname}
				/>
			</SidebarContent>
			<SidebarFooter>
				<SettingsDialog />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
