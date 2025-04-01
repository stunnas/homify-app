// program-switcher.tsx

'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/shadcn/sidebar';

import { Program } from '@/lib/data/nav-data';
import { cn } from '@/lib/utils';

interface ProgramSwitcherProps {
	programs: Program[];
	activeProgram: Program;
	onProgramChange: (program: Program) => void;
}

export function ProgramSwitcher({
	programs,
	activeProgram,
	onProgramChange,
}: ProgramSwitcherProps) {
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
								<activeProgram.logo className='size-4' />
							</div>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-semibold'>
									{activeProgram.name}
								</span>
							</div>
							<ChevronsUpDown className='ml-auto' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						align='start'
						side={isMobile ? 'bottom' : 'right'}
						sideOffset={4}
					>
						<DropdownMenuLabel className='text-xs text-muted-foreground'>
							Programs
						</DropdownMenuLabel>

						{programs.map((program, index) => (
							<DropdownMenuItem
								key={program.name}
								onClick={() => onProgramChange(program)}
								className={cn(
									'gap-2 p-2 cursor-pointer',
									`${
										activeProgram.slug === program.slug &&
										'border bg-accent text-accent-foreground'
									}`
								)}
							>
								<div className='flex size-6 items-center justify-center rounded-sm border'>
									<program.logo className='size-4 shrink-0' />
								</div>
								{program.name}
								<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
