'use client';

import { useEffect, useState } from 'react';
import { useAccent } from '@/components/providers/accent-provider';
import { useTheme } from 'next-themes';

export function useElectricBorderColor(): string {
        const { currentAccent } = useAccent();
        const { resolvedTheme } = useTheme();
        const [borderColor, setBorderColor] = useState<string>('#000000');

        // track when we're mounted so we know theme is available
        const [mounted, setMounted] = useState(false);
        useEffect(() => {
                setMounted(true);
        }, []);

        useEffect(() => {
                // We don't have reliable theme info until after mount.
                if (!mounted) return;
                if (!resolvedTheme) return;
                const accentKey = currentAccent ?? 'default';
                if (accentKey === 'default') {
                        // contrast color for default accent
                        setBorderColor(
                                resolvedTheme === 'dark' ? '#ffffff' : '#000000'
                        );
                        return;
                }

                // non-default accent -> trust the CSS var
                setBorderColor('hsl(var(--accent))');
        }, [mounted, currentAccent, resolvedTheme]);

        return borderColor;
}
