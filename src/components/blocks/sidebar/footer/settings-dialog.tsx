// settings-dialog.tsx
import { useState } from 'react';
import { settingsRegistry } from '@/components/blocks/sidebar/footer/settings-panels';
import { Button } from '@/components/ui/shadcn/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/shadcn/dialog';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from '@/components/ui/shadcn/sidebar';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/shadcn/breadcrumb';
import { Separator } from '@/components/ui/shadcn/separator';
import { useAccent } from '@/components/providers/accent-provider';
import { SETTINGS_DATA } from '@/lib/data/settings-data';
import { Settings } from 'lucide-react';
import { useSidebar } from '@/components/ui/shadcn/sidebar';

export function SettingsDialog() {
	const [open, setOpen] = useState(false);
	const [selectedSection, setSelectedSection] = useState<string>('General');
	const { currentAccent } = useAccent();
	const { state } = useSidebar();
	const isCollapsed = state === 'collapsed';
	const PanelComponent =
		settingsRegistry[selectedSection] ?? (() => <p>No settings found.</p>);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						tooltip='Settings'
						size='sm'
					>
						<DialogTrigger asChild>
							<Button
								size='sm'
								variant={currentAccent === 'default' ? 'default' : 'accent'}
								className='flex justify-center items-center'
							>
								{!isCollapsed && 'Settings'} <Settings />
							</Button>
						</DialogTrigger>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
			<DialogContent className='overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]'>
				<DialogTitle className='sr-only'>Settings</DialogTitle>
				<DialogDescription className='sr-only'>
					All notable personalization
				</DialogDescription>

				<SidebarProvider className='items-start'>
					<Sidebar
						collapsible='none'
						className='flex'
					>
						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupContent>
									<SidebarMenu>
										{SETTINGS_DATA.nav.map((item) => {
											const isActive = item.name === selectedSection;
											return (
												<SidebarMenuItem key={item.name}>
													<SidebarMenuButton
														asChild
														isActive={isActive}
														variant={
															currentAccent === 'default' ? 'default' : 'accent'
														}
													>
														<button
															type='button'
															className='w-full text-left'
															onClick={() => setSelectedSection(item.name)}
														>
															<item.icon />
															<span>{item.name}</span>
														</button>
													</SidebarMenuButton>
												</SidebarMenuItem>
											);
										})}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</SidebarContent>
					</Sidebar>

					<main className='flex h-[480px] flex-1 flex-col overflow-hidden'>
						<header className='flex h-16 shrink-0 items-center gap-2 ...'>
							<div className='flex items-center gap-2 px-4'>
								<Breadcrumb>
									<BreadcrumbList>
										<BreadcrumbItem className='hidden md:block'>
											<BreadcrumbPage className='text-muted-foreground'>
												Settings
											</BreadcrumbPage>
										</BreadcrumbItem>
										<BreadcrumbSeparator className='hidden md:block' />
										<BreadcrumbItem>
											<BreadcrumbPage>{selectedSection}</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>
						</header>
						<Separator />
						<div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0'>
							<PanelComponent />
						</div>
					</main>
				</SidebarProvider>
			</DialogContent>
		</Dialog>
	);
}
