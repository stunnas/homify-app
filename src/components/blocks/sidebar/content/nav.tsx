// nav.tsx

'use client';

import { ChevronRight } from 'lucide-react';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/shadcn/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/shadcn/sidebar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuLabel,
} from '@/components/ui/shadcn/dropdown-menu';
import { useSidebar } from '@/components/ui/shadcn/sidebar';
import { cn } from '@/lib/utils';
import { useAccent } from '@/lib/providers/accent-provider';
import { NavItem } from '@/lib/data/nav-data';

interface NavProps {
	items: NavItem[];
	baseSlug: string;
	currentPath?: string;
}

export function Nav({ items, baseSlug, currentPath }: NavProps) {
	const { state } = useSidebar();
	const isCollapsed = state === 'collapsed';
	const { currentAccent } = useAccent();
	
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const hasChildren = item.items && item.items.length > 0;
					const Icon = item.icon;
					const dropdownItems = item.items ?? [];
					return (
						<SidebarMenuItem key={item.title}>
							{isCollapsed && hasChildren ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton
											size='lg'
											tooltip={item.title}
											variant={
												currentAccent === 'default' ? 'default' : 'accent'
											}
											className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
										>
											<div
												className={cn(
													'flex aspect-square size-8 items-center justify-center rounded-lg',
													// currentAccent === 'default'
													// 	? 'bg-primary text-background'
													// 	: 'bg-accent text-accent-foreground'
												)}
											>
												<item.icon className='size-4' />
											</div>
										</SidebarMenuButton>
									</DropdownMenuTrigger>

									<DropdownMenuContent
										className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
										align='start'
										side='right'
										sideOffset={4}
									>
										<DropdownMenuLabel className='text-xs text-muted-foreground'>
											{item.title}
										</DropdownMenuLabel>

										{item.items!.map((subItem, index) => {
											const href = `/${baseSlug}/${item.url}/${subItem.url}`;
											const isActive = currentPath === href;
											return (
												<DropdownMenuItem
													key={subItem.title}
													asChild
													className={cn(
														'gap-2 p-2 m-2 cursor-pointer border',
														isActive &&
															(currentAccent === 'default'
																? 'bg-primary text-background'
																: 'bg-accent text-accent-foreground')
													)}
												>
													<a href={href}>{subItem.title}</a>
												</DropdownMenuItem>
											);
										})}
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<Collapsible
									asChild
									defaultOpen={item.isActive}
									className='group/collapsible'
								>
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton tooltip={item.title}>
												{Icon && <Icon />}
												<span>{item.title}</span>
												<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{dropdownItems.map((subItem) => {
													const href = `/${baseSlug}/${item.url}/${subItem.url}`;
													const isActive = currentPath === href;
													return (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton
																asChild
																isActive={isActive}
																variant={isActive ? 'accent' : 'default'}
															>
																<a href={href}>
																	<span>{subItem.title}</span>
																</a>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													);
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								</Collapsible>
							)}
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
