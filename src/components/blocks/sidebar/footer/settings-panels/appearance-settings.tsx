import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/shadcn/radio-group';
import { Label } from '@/components/ui/shadcn/label';
import { Separator } from '@/components/ui/shadcn/separator';
import { useTheme } from 'next-themes';
import {
	themeOptions,
	accentOptions,
} from '@/lib/data/settings/appearance-data';
import { transitionClass, useAccent } from '@/lib/providers/accent-provider';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/shadcn/button';

export function AppearanceSettings() {
	const { theme, setTheme } = useTheme();
	const { currentAccent, setAccent } = useAccent();

	const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
		setTheme(newTheme);
	};

	function handleAccentColorChange(value: string) {
		setAccent(value);
	}

	return (
		<div className='space-y-4'>
			<div className='space-y-4'>
				<h3 className='text-lg font-medium'>Theme</h3>
				<p className='text-sm text-muted-foreground'>
					Select the theme for the dashboard
				</p>
				<RadioGroup
					defaultValue={theme}
					onValueChange={handleThemeChange}
					className='flex gap-4 pt-2'
				>
					{themeOptions.map((themeOpt) => {
						return (
							<div
								key={themeOpt.value}
								className='flex items-center space-x-2'
							>
								<RadioGroupItem
									value={themeOpt.value}
									id={`theme-${themeOpt.value}`}
								/>
								<Label
									htmlFor={`theme-${themeOpt.value}`}
									className='flex items-center gap-2'
								>
									<span>{themeOpt.name}</span>
								</Label>
							</div>
						);
					})}
				</RadioGroup>
			</div>

			<Separator />

			<div className='space-y-4'>
				<h3 className='text-lg font-medium'>Accent Color</h3>
				<p className='text-sm text-muted-foreground'>
					Choose a custom accent color for the interface
				</p>
				<div className='grid grid-cols-2 gap-3 pt-2'>
					{accentOptions.map((color) => {
						const isActive = currentAccent === color.value;
						return (
							<button
								key={color.value}
								onClick={() => handleAccentColorChange(color.value)}
								className={cn(
									'flex items-center justify-between rounded-md border-2 p-2',
									transitionClass,
									isActive
										? currentAccent === 'default'
											? 'border-primary'
											: 'border-accent'
										: color.hoverClass
								)}
							>
								<div className='flex items-center gap-2'>
									<div className={cn('h-5 w-5 rounded-full', color.class)} />
									<span>{color.name}</span>
								</div>
								{isActive && <Check className='h-4 w-4 text-primary' />}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
