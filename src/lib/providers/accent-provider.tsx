// src/lib/providers/accent-provider.tsx
'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import {
	accentColorMap,
	mutedAccentColorMap,
} from '@/lib/data/appearance-data';

// We expose a context so other components can read the "currentAccent"
interface AccentContextValue {
	currentAccent: string; // e.g. "default", "blue", "purple"
	setAccent: (accent: string) => void;
}

const AccentContext = createContext<AccentContextValue>({
	currentAccent: 'default',
	setAccent: () => {},
});

function getStoredAccent() {
	if (typeof window === 'undefined') return 'default';
	return localStorage.getItem('accentColor') || 'default';
}

/**
 * If accent != "default", override the CSS variables.
 * Otherwise remove them so :root / .dark handles it.
 */
export function updateRootAccent(accent: string) {
	if (typeof window !== 'undefined') {
		localStorage.setItem('accentColor', accent);
	}
	if (typeof document === 'undefined') return;

	const docEl = document.documentElement;

	if (accent === 'default') {
		// remove overrides => use normal theme from globals.css
		docEl.style.removeProperty('--accent');
		docEl.style.removeProperty('--accent-foreground');
		docEl.style.removeProperty('--muted-accent');
		docEl.style.removeProperty('--muted-accent-foreground');
		// also remove scrollbar overrides => fallback to :root / .dark
		docEl.style.removeProperty('--scrollbar');
		docEl.style.removeProperty('--scrollbar-foreground');
		return;
	}

	// If accent is not "default," pick the custom HSL
	const mainHsl = accentColorMap[accent] ?? accentColorMap.default;
	const mutedHsl = mutedAccentColorMap[accent] ?? mutedAccentColorMap.default;

	docEl.style.setProperty('--accent', mainHsl);
	docEl.style.setProperty('--muted-accent', mutedHsl);

	// Dynamic foreground (black or white)
	const mainFg = pickForegroundForAccent(mainHsl);
	const mutedFg = pickForegroundForAccent(mutedHsl);
	docEl.style.setProperty('--accent-foreground', mainFg);
	docEl.style.setProperty('--muted-accent-foreground', mutedFg);

	// If you want the scrollbar to match the main accent,
	// set --scrollbar = mainHsl, --scrollbar-foreground = mainFg or something else
	docEl.style.setProperty('--scrollbar', mainHsl);
	docEl.style.setProperty('--scrollbar-foreground', mainFg);
}

// Very rough check if HSL lightness > 70 => black text, else white
function pickForegroundForAccent(hsl: string) {
	const parts = hsl.trim().split(/\s+/);
	if (parts.length < 3) return '0 0% 100%'; // fallback white
	const lStr = parts[2].replace('%', '');
	const lightness = Number(lStr);
	return lightness > 70 ? '0 0% 0%' : '0 0% 100%';
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
	const [accent, setAccent] = useState<string>('default');

	useEffect(() => {
		const stored = getStoredAccent();
		setAccent(stored);
		updateRootAccent(stored);
	}, []);

	// Provide the accent in context so others can read it
	const value: AccentContextValue = {
		currentAccent: accent,
		setAccent: (newAccent) => {
			setAccent(newAccent);
			updateRootAccent(newAccent);
		},
	};

	return (
		<AccentContext.Provider value={value}>{children}</AccentContext.Provider>
	);
}

export function useAccent() {
	return useContext(AccentContext);
}

export function useAccentClass({
	withBackground = true,
	withText = false,
	withHover = false,
	withBorder = false,
}: {
	withBackground?: boolean;
	withText?: boolean;
	withHover?: boolean;
	withBorder?: boolean;
} = {}): string {
	const { currentAccent } = useAccent();
	const isDefault = currentAccent === 'default';

	let base = '';

	if (withBackground) {
		base += isDefault ? 'bg-primary' : 'bg-accent';
	}

	if (withText) {
		base += isDefault ? ' text-primary-foreground' : ' text-accent-foreground';
	}

	if (withBorder) {
		base += isDefault ? ' border border-primary' : ' border border-accent';
	}

	if (withHover) {
		base += isDefault ? '' : ' hover:bg-mutedAccent';
	}

	return base.trim();
}
