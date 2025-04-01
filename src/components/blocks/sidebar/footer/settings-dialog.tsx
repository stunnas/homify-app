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
	BreadcrumbLink,
} from '@/components/ui/shadcn/breadcrumb';
import { data } from '@/lib/data/settings-data';

export function SettingsDialog() {
	const [open, setOpen] = useState(false);

	// default pick
	const [selectedSection, setSelectedSection] =
		useState<string>('General');

	// Look up the component for the selected section:
	const PanelComponent =
		settingsRegistry[selectedSection] ?? (() => <p>No settings found.</p>);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<Button size='sm'>Settings</Button>
			</DialogTrigger>
			<DialogContent className='overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]'>
				<DialogTitle className='sr-only'>Settings</DialogTitle>
				<DialogDescription className='sr-only'>...</DialogDescription>

				<SidebarProvider className='items-start'>
					<Sidebar
						collapsible='none'
						className='hidden md:flex'
					>
						<SidebarContent>
							<SidebarGroup>
								<SidebarGroupContent>
									<SidebarMenu>
										{data.nav.map((item) => {
											const isActive = item.name === selectedSection;
											return (
												<SidebarMenuItem key={item.name}>
													<SidebarMenuButton
														asChild
														isActive={isActive}
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
											<BreadcrumbLink href='#'>Settings</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator className='hidden md:block' />
										<BreadcrumbItem>
											<BreadcrumbPage>{selectedSection}</BreadcrumbPage>
										</BreadcrumbItem>
									</BreadcrumbList>
								</Breadcrumb>
							</div>
						</header>

						<div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0'>
							<PanelComponent />
						</div>
					</main>
				</SidebarProvider>
			</DialogContent>
		</Dialog>
	);
}
