import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppSidebar } from '@/components/blocks/sidebar/app-sidebar';
import {
	SidebarProvider,
	SidebarTrigger,
	SidebarInset,
} from '@/components/ui/shadcn/sidebar';
import { Separator } from '@/components/ui/shadcn/separator';
import { DynamicBreadcrumbs } from '@/components/blocks/sidebar/content/dynamic-breadcrumbs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Homify',
	description: 'A bunch of personal tools!',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<SidebarProvider>
					<AppSidebar />
					<main className='w-full min-h-screen'>
						<SidebarInset>
							<header className='flex w-full h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
								<div className='flex w-full items-center gap-2 px-4'>
									<SidebarTrigger />
									<Separator
										orientation='vertical'
										className='mx-2 h-4'
									/>
									<DynamicBreadcrumbs />
								</div>
							</header>
						</SidebarInset>
						<div className='w-full p-4'>{children}</div>
					</main>
				</SidebarProvider>
			</body>
		</html>
	);
}
