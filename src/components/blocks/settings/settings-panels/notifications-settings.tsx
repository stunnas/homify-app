'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/shadcn/label';
import { Switch } from '@/components/ui/shadcn/switch';
import { Separator } from '@/components/ui/shadcn/separator';
import { NOTIFICATION_SETTINGS_SECTIONS } from '@/lib/data/settings/notification-data';

export function NotificationsSettings() {
	const [settings, setSettings] = useState(() => {
		// Initialize settings with default values
		return NOTIFICATION_SETTINGS_SECTIONS.reduce((acc, section) => {
			acc[section.id] = section.defaultValue;
			return acc;
		}, {} as Record<string, boolean>);
	});

	const handleSettingChange = (sectionId: string, value: boolean) => {
		setSettings((prev) => ({
			...prev,
			[sectionId]: value,
		}));
	};

	return (
		<div className='space-y-6'>
			{NOTIFICATION_SETTINGS_SECTIONS.map((section, index) => (
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
								{section.label}
							</Label>
						</div>
					</div>

					{index < NOTIFICATION_SETTINGS_SECTIONS.length - 1 && (
						<Separator className='my-6' />
					)}
				</div>
			))}
		</div>
	);
}
