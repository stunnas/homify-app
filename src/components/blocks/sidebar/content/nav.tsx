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
import { NavItem } from '@/lib/data/nav-data';
import { cn } from '@/lib/utils';
import { useAccentClass } from '@/lib/providers/accent-provider';

interface NavProps {
	items: NavItem[];
	baseSlug: string;
	currentPath?: string;
}

export function Nav({ items, baseSlug, currentPath }: NavProps) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					return (
						<Collapsible
							key={item.title}
							asChild
							defaultOpen={item.isActive}
							className='group/collapsible'
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton tooltip={item.title}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
										<ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{(item.items ?? []).map((subItem) => {
											const href = `/${baseSlug}/${item.url}/${subItem.url}`;
											return (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<a
															href={href}
															className={
																currentPath === href
																	? cn(
																			'bg-sidebar-accent border ',
																			useAccentClass({
																				withBackground: false,
																				withBorder: true,
																				withHover: true,
																			})
																	  )
																	: ''
															}
														>
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											);
										})}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
