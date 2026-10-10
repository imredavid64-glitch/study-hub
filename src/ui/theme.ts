import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | Record<string, boolean> | undefined | null | false)[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return twMerge(classes.join(' '));
}

export const themeTokens = {
  colors: {
    light: {
      bg: '#f4f5ed',
      panel: '#fffdf7',
      card: '#fffdf7',
      border: '#dbe8e4',
      text: '#1f2b2b',
      muted: '#5f6a69',
      accent: '#0f766e',
      'accent-soft': '#d7efec',
      danger: '#b42318',
      warning: '#e6a700',
      success: '#237a57',
    },
    dark: {
      bg: '#0a0f0e',
      panel: '#111817',
      card: '#141d1c',
      border: '#2a3a38',
      text: '#e8efe8',
      muted: '#8a9a98',
      accent: '#14b8a6',
      'accent-soft': '#134e4a',
      danger: '#f87171',
      warning: '#fbbf24',
      success: '#4ade80',
    },
    themes: {
      teal: { accent: '#0f766e', 'accent-soft': '#d7efec' },
      slate: { accent: '#475569', 'accent-soft': '#e2e8f0' },
      warm: { accent: '#b45309', 'accent-soft': '#fef3c7' },
    },
  },
  spacing: {
    1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '24px', 6: '32px', 8: '48px', 10: '64px',
  },
  radius: {
    sm: '8px', md: '12px', lg: '18px', xl: '24px', full: '9999px',
  },
  typography: {
    fontSans: "'Space Grotesk', system-ui, sans-serif",
    fontSerif: "'Crimson Pro', Georgia, serif",
    sizes: {
      xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem',
      '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
    },
    weights: { normal: 400, medium: 500, semibold: 600, bold: 700 },
  },
  shadows: {
    sm: '0 1px 2px rgba(18, 36, 34, 0.05)',
    md: '0 4px 12px rgba(18, 36, 34, 0.1)',
    lg: '0 16px 35px rgba(18, 36, 34, 0.12)',
    xl: '0 24px 48px rgba(18, 36, 34, 0.15)',
  },
  transitions: {
    fast: '100ms ease', base: '150ms ease', slow: '250ms ease',
  },
  zIndex: {
    base: 0, dropdown: 100, modal: 200, toast: 300, tooltip: 400,
  },
  breakpoints: {
    sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px',
  },
} as const;

export function generateCSSVariables(): string {
  const light = themeTokens.colors.light;
  const dark = themeTokens.colors.dark;

  return `
    :root {
      --color-bg: ${light.bg};
      --color-panel: ${light.panel};
      --color-card: ${light.card};
      --color-border: ${light.border};
      --color-text: ${light.text};
      --color-muted: ${light.muted};
      --color-accent: ${light.accent};
      --color-accent-soft: ${light['accent-soft']};
      --color-danger: ${light.danger};
      --color-warning: ${light.warning};
      --color-success: ${light.success};
      --font-sans: ${themeTokens.typography.fontSans};
      --font-serif: ${themeTokens.typography.fontSerif};
      --radius-sm: ${themeTokens.radius.sm};
      --radius-md: ${themeTokens.radius.md};
      --radius-lg: ${themeTokens.radius.lg};
      --radius-xl: ${themeTokens.radius.xl};
      --radius-full: ${themeTokens.radius.full};
      --shadow-sm: ${themeTokens.shadows.sm};
      --shadow-md: ${themeTokens.shadows.md};
      --shadow-lg: ${themeTokens.shadows.lg};
      --shadow-xl: ${themeTokens.shadows.xl};
      --transition-fast: ${themeTokens.transitions.fast};
      --transition-base: ${themeTokens.transitions.base};
      --transition-slow: ${themeTokens.transitions.slow};
    }
    [data-theme="dark"] {
      --color-bg: ${dark.bg};
      --color-panel: ${dark.panel};
      --color-card: ${dark.card};
      --color-border: ${dark.border};
      --color-text: ${dark.text};
      --color-muted: ${dark.muted};
      --color-accent: ${dark.accent};
      --color-accent-soft: ${dark['accent-soft']};
      --color-danger: ${dark.danger};
      --color-warning: ${dark.warning};
      --color-success: ${dark.success};
    }
    [data-density="compact"] {
      --space-unit: 0.75;
    }
    [data-density="comfortable"] {
      --space-unit: 1;
    }
    [data-font-size="sm"] { --font-scale: 0.875; }
    [data-font-size="md"] { --font-scale: 1; }
    [data-font-size="lg"] { --font-scale: 1.125; }
  `;
}

export function applyTheme(theme: keyof typeof themeTokens.colors.themes): void {
  const tokens = themeTokens.colors.themes[theme];
  const root = document.documentElement;
  root.style.setProperty('--color-accent', tokens.accent);
  root.style.setProperty('--color-accent-soft', tokens['accent-soft']);
  root.setAttribute('data-accent-theme', theme);
}

export function applyDensity(density: 'compact' | 'comfortable'): void {
  document.documentElement.setAttribute('data-density', density);
}

export function applyFontSize(size: 'sm' | 'md' | 'lg'): void {
  document.documentElement.setAttribute('data-font-size', size);
}

export function applyDarkMode(dark: boolean): void {
  document.body.classList.toggle('dark', dark);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

export function applyReducedMotion(reduced: boolean): void {
  document.body.classList.toggle('reduced-motion', reduced);
}