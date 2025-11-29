export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    // Background colors
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgGlow: string;

    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;

    // Accent colors
    accent: string;
    accentGlow: string;
    accentMuted: string;

    // Border colors
    borderLight: string;
    borderMedium: string;

    // Status colors (kept consistent across themes)
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    sans: string;
    display: string;
    mono: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'neuroflow',
    name: 'NeuroFlow',
    description: 'Default dark navy with cyan accents',
    colors: {
      bgPrimary: '#161b2e',
      bgSecondary: '#1a1f35',
      bgTertiary: '#1e2338',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      textPrimary: '#e2e8f0',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      accent: '#22d3ee',
      accentGlow: 'rgba(6, 182, 212, 0.5)',
      accentMuted: 'rgba(6, 182, 212, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      sans: "'Manrope', sans-serif",
      display: "'Manrope', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Ultra-minimal pure black with subtle accents',
    colors: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#121212',
      bgTertiary: '#21212154', // zinc-900 with opacity
      bgGlow: 'rgba(255, 255, 255, 0.02)',
      textPrimary: '#ffffff',
      textSecondary: '#a8a8a8',
      textMuted: '#6b6b6b',
      accent: '#2070c2',
      accentGlow: 'rgba(82, 167, 255, 0.3)',
      accentMuted: 'rgba(82, 167, 255, 0.08)',
      borderLight: 'rgba(255, 255, 255, 0.04)',
      borderMedium: 'rgba(255, 255, 255, 0.08)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      sans: "'Manrope', sans-serif",
      display: "'Manrope', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'mono',
    name: 'Monochrome',
    description: 'Pure grayscale minimalism',
    colors: {
      bgPrimary: '#0d0d0d',
      bgSecondary: '#171717',
      bgTertiary: '#242424',
      bgGlow: 'rgba(255, 255, 255, 0.03)',
      textPrimary: '#fafafa',
      textSecondary: '#b3b3b3',
      textMuted: '#666666',
      accent: '#ffffff38',
      accentGlow: 'rgba(255, 255, 255, 0.4)',
      accentMuted: 'rgba(255, 255, 255, 0.06)',
      borderLight: 'rgba(255, 255, 255, 0.06)',
      borderMedium: 'rgba(255, 255, 255, 0.12)',
      success: '#d4d4d4',
      warning: '#e5e5e5',
      error: '#a3a3a3',
    },
    fonts: {
      sans: "'Manrope', sans-serif",
      display: "'Manrope', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    description: 'Aurora borealis inspired blues \u0026 purples',
    colors: {
      bgPrimary: '#0d1117',
      bgSecondary: '#161b22',
      bgTertiary: '#21262d',
      bgGlow: 'rgba(88, 166, 255, 0.12)',
      textPrimary: '#e6edf3',
      textSecondary: '#8b949e',
      textMuted: '#6e7681',
      accent: '#2f6fff82',
      accentGlow: 'rgba(88, 166, 255, 0.5)',
      accentMuted: 'rgba(88, 166, 255, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#3fb950',
      warning: '#d29922',
      error: '#f85149',
    },
    fonts: {
      sans: "'Manrope', sans-serif",
      display: "'Manrope', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'true-neutral',
    name: 'Industrial Dark',
    description: 'Strict Industrial Dark (Zinc/Black)',
    colors: {
      bgPrimary: '#09090b', // zinc-950
      bgSecondary: '#000000', // black
      bgTertiary: '#18181b', // zinc-900
      bgGlow: 'rgba(255, 255, 255, 0.02)',
      textPrimary: '#f4f4f5', // zinc-100
      textSecondary: '#a1a1aa', // zinc-400
      textMuted: '#52525b', // zinc-600
      accent: '#8d8d8db8',
      accentGlow: 'rgba(255, 255, 255, 0.15)',
      accentMuted: 'rgba(255, 255, 255, 0.05)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      sans: "'Manrope', sans-serif",
      display: "'Manrope', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
];

export const getThemeById = (id: string): Theme => {
  return themes.find(t => t.id === id) || themes[0];
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;

  // Apply colors
  root.style.setProperty('--bg-primary', theme.colors.bgPrimary);
  root.style.setProperty('--bg-secondary', theme.colors.bgSecondary);
  root.style.setProperty('--bg-tertiary', theme.colors.bgTertiary);
  root.style.setProperty('--bg-glow', theme.colors.bgGlow);

  root.style.setProperty('--text-primary', theme.colors.textPrimary);
  root.style.setProperty('--text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--text-muted', theme.colors.textMuted);

  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--accent-glow', theme.colors.accentGlow);
  root.style.setProperty('--accent-muted', theme.colors.accentMuted);

  root.style.setProperty('--border-light', theme.colors.borderLight);
  root.style.setProperty('--border-medium', theme.colors.borderMedium);

  root.style.setProperty('--success', theme.colors.success);
  root.style.setProperty('--warning', theme.colors.warning);
  root.style.setProperty('--error', theme.colors.error);

  // Apply fonts
  root.style.setProperty('--font-sans', theme.fonts.sans);
  root.style.setProperty('--font-display', theme.fonts.display);
  root.style.setProperty('--font-mono', theme.fonts.mono);

  // Set theme id as data attribute for potential CSS selectors
  root.setAttribute('data-theme', theme.id);
};
