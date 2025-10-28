'use client';

import { SoundyButton } from '@/components/ui/caa/sound/soundy-button';
import { Separator } from '@/components/ui/shadcn/separator';
import { ExternalLink, FileText, Copy } from 'lucide-react';
import { useAccent } from '@/components/providers/accent-provider';
import {
	ABOUT_SETTINGS_SECTIONS,
	APP_VERSION,
	CHANGELOG_ENTRIES,
	LICENSE_LINKS,
} from '@/lib/data/settings/about-data';

export function AboutSettings() {
	const { currentAccent } = useAccent();
	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		// You could add a toast notification here
	};

	return (
		<div className='space-y-6'>
			{ABOUT_SETTINGS_SECTIONS.map((section, index) => (
				<div key={section.id}>
					<div className='space-y-3'>
						<h3 className='text-lg font-medium'>{section.title}</h3>
						{section.description && (
							<p className='text-sm text-muted-foreground'>
								{section.description}
							</p>
						)}

						{section.type === 'version' && (
							<div className='rounded-md border p-4 bg-muted/20'>
								<div className='grid grid-cols-2 gap-2'>
									<div className='text-sm font-medium'>Version</div>
									<div className='text-sm flex items-center gap-2'>
										{APP_VERSION.version}
										<SoundyButton
											variant='ghost'
											size='icon'
											className='h-6 w-6'
											onClick={() => copyToClipboard(APP_VERSION.version)}
										>
											<Copy className='h-3 w-3' />
											<span className='sr-only'>Copy version</span>
										</SoundyButton>
									</div>

									<div className='text-sm font-medium'>Build</div>
									<div className='text-sm flex items-center gap-2'>
										{APP_VERSION.build}
										<SoundyButton
											variant='ghost'
											size='icon'
											className='h-6 w-6'
											onClick={() => copyToClipboard(APP_VERSION.build)}
										>
											<Copy className='h-3 w-3' />
											<span className='sr-only'>Copy build number</span>
										</SoundyButton>
									</div>
								</div>
							</div>
						)}

						{section.type === 'changelog' && (
							<>
								<div className='rounded-md border p-4 max-h-40 overflow-y-auto bg-muted/20'>
									<div className='space-y-3'>
										{CHANGELOG_ENTRIES.map((entry) => (
											<div key={entry.version}>
												<h4 className='text-sm font-medium'>
													Version {entry.version}
												</h4>
												<ul className='text-sm list-disc pl-5 pt-1 text-muted-foreground'>
													{entry.changes.map((change, i) => (
														<li key={i}>{change}</li>
													))}
												</ul>
											</div>
										))}
									</div>
								</div>
								{section.action && (
									<SoundyButton
										variant={`${currentAccent === 'default' ? 'outline' : 'accent'}`}
										className='flex items-center gap-2 mt-2'
									>
										<FileText className='h-4 w-4' />
										{section.action.label}
									</SoundyButton>
								)}
							</>
						)}

						{section.type === 'links' && (
							<div className='flex flex-col gap-2'>
								{LICENSE_LINKS.map((link) => (
									<SoundyButton
										key={link.label}
										variant='outline'
										className='flex items-center justify-between w-full'
										onClick={() => window.open(link.url, '_blank')}
									>
										<span>{link.label}</span>
										<ExternalLink className='h-4 w-4' />
									</SoundyButton>
								))}
							</div>
						)}
					</div>

					{index < ABOUT_SETTINGS_SECTIONS.length - 1 && (
						<Separator className='my-6' />
					)}
				</div>
			))}
		</div>
	);
}
