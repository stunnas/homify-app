'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/shadcn/label';
import { Switch } from '@/components/ui/shadcn/switch';
import { Button } from '@/components/ui/shadcn/button';
import { Separator } from '@/components/ui/shadcn/separator';
import { Download } from 'lucide-react';
import { useAccent } from '@/lib/providers/accent-provider';
import { LOGS_SETTINGS_SECTIONS } from '@/lib/data/settings/logs-data';

export function LogsSettings() {
	const [settings, setSettings] = useState(() => {
		// Initialize settings with default values
		return LOGS_SETTINGS_SECTIONS.reduce((acc, section) => {
			acc[section.id] = section.defaultValue;
			return acc;
		}, {} as Record<string, boolean>);
	});
	const { currentAccent } = useAccent();

	const handleSettingChange = (sectionId: string, value: boolean) => {
		setSettings((prev) => ({
			...prev,
			[sectionId]: value,
		}));
	};

	const handleDownloadLogs = () => {
		console.log('Downloading logs...');
		// Implement log download functionality
	};

	return (
		<div className='space-y-6'>
			{LOGS_SETTINGS_SECTIONS.map((section, index) => (
				<div key={section.id}>
					<div className='space-y-3'>
						<h3 className='text-lg font-medium'>{section.title}</h3>
						<p className='text-sm text-muted-foreground'>
							{section.description}
						</p>
						<div className='flex items-center space-x-2 pt-2'>
							<Switch
								id={section.id}
								checked={settings[section.id]}
								onCheckedChange={(value) =>
									handleSettingChange(section.id, value)
								}
							/>
							<Label htmlFor={section.id}>
								{section.id === 'verboseLogs'
									? 'Enable verbose logging'
									: section.id === 'consoleOverlay'
									? 'Show console overlay'
									: 'Save logs to file'}
							</Label>
						</div>

						{section.hasAction && (
							<div className='pt-4'>
								<Button
									variant={`${currentAccent === 'default' ? 'outline' : 'accent'}`}
									className='flex items-center gap-2'
									onClick={handleDownloadLogs}
								>
									<Download className='h-4 w-4' />
									{section.actionLabel}
								</Button>
							</div>
						)}
					</div>

					{index < LOGS_SETTINGS_SECTIONS.length - 1 && (
						<Separator className='my-6' />
					)}
				</div>
			))}
		</div>
	);
}
