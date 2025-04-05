'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/shadcn/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/shadcn/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/shadcn/select';
import { Separator } from '@/components/ui/shadcn/separator';
import { GENERAL_SETTINGS_SECTIONS } from '@/lib/data/settings/general-data';

export function GeneralSettings() {
	const [settings, setSettings] = useState(() => {
		// Initialize settings with default values
		return GENERAL_SETTINGS_SECTIONS.reduce((acc, section) => {
			acc[section.id] = section.defaultValue;
			return acc;
		}, {} as Record<string, string>);
	});

	const handleSettingChange = (sectionId: string, value: string) => {
		setSettings((prev) => ({
			...prev,
			[sectionId]: value,
		}));
	};

	return (
		<div className='space-y-6'>
			{GENERAL_SETTINGS_SECTIONS.map((section, index) => (
				<div key={section.id}>
					<div className='space-y-3'>
						<h3 className='text-lg font-medium'>{section.title}</h3>
						<p className='text-sm text-muted-foreground'>
							{section.description}
						</p>

						{section.type === 'radio' && (
							<RadioGroup
								value={settings[section.id]}
								onValueChange={(value) =>
									handleSettingChange(section.id, value)
								}
								className={
									section.id === 'defaultMode'
										? 'flex gap-4 pt-2'
										: 'flex flex-col gap-2 pt-2'
								}
							>
								{section.options.map((option) => (
									<div
										key={option.id}
										className='flex items-center space-x-2'
									>
										<RadioGroupItem
											value={option.id}
											id={`${section.id}-${option.id}`}
										/>
										<Label htmlFor={`${section.id}-${option.id}`}>
											{option.label}
										</Label>
									</div>
								))}
							</RadioGroup>
						)}

						{section.type === 'select' && (
							<Select
								value={settings[section.id]}
								onValueChange={(value) =>
									handleSettingChange(section.id, value)
								}
							>
								<SelectTrigger className='w-full max-w-xs'>
									<SelectValue
										placeholder={`Select ${section.title.toLowerCase()}`}
									/>
								</SelectTrigger>
								<SelectContent>
									{section.options.map((option) => (
										<SelectItem
											key={option.id}
											value={option.id}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					</div>

					{index < GENERAL_SETTINGS_SECTIONS.length - 1 && (
						<Separator className='my-6' />
					)}
				</div>
			))}
		</div>
	);
}
