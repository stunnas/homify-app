import { Sun, Moon, Monitor } from 'lucide-react';

export const themeOptions = [
	{ name: 'Light', value: 'light', icon: Sun },
	{ name: 'Dark', value: 'dark', icon: Moon },
	{ name: 'System', value: 'system', icon: Monitor },
];

export const accentOptions = [
	{ name: 'Default', value: 'default', class: 'bg-primary' },
	{ name: 'Purple', value: 'purple', class: 'bg-purple-500' },
	{ name: 'Green', value: 'green', class: 'bg-green-500' },
	{ name: 'Blue', value: 'blue', class: 'bg-blue-500' },
	{ name: 'Red', value: 'red', class: 'bg-red-500' },
	{ name: 'Orange', value: 'orange', class: 'bg-orange-500' },
	{ name: 'Pink', value: 'pink', class: 'bg-pink-500' },
	{ name: 'Teal', value: 'teal', class: 'bg-teal-500' },
];

/**
 * Maps each `accentOptions.value` -> an HSL triple for `--accent`.
 * The user sees the preview circle from `accentOptions.class`,
 * but actual "scrollbar color" etc. come from this HSL.
 */
export const accentColorMap: Record<string, string> = {
	default: '0 0% 96.1%', // from :root in globals.css
	purple: '259 94% 80%', // #a78bfa or tailwind "purple-400/500" approximate
	green: '134 75% 76%', // #86efac
	blue: '213 92% 67%', // #60a5fa
	red: '2 89% 70%', // #f87171
	orange: '24 96% 60%', // #fb923c
	pink: '340 86% 72%', // #f472b6
	teal: '172 79% 39%', // #14b8a6
};

/**
 * Each muted color is roughly +10% lightness from the main accent,
 * so it appears noticeably lighter/muted but still in the same hue.
 */
export const mutedAccentColorMap: Record<string, string> = {
	default: '0 0% 98%',
	purple: '259 94% 90%',
	green: '134 75% 86%',
	blue: '213 92% 77%',
	red: '2 89% 80%',
	orange: '24 96% 70%',
	pink: '340 86% 82%',
	teal: '172 79% 49%',
};
