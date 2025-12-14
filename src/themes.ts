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
    description: 'Eye-friendly dark with subtle accents',
    colors: {
      bgPrimary: '#0a0a0f',
      bgSecondary: '#121218',
      bgTertiary: '#1a1a24',
      bgGlow: 'rgba(255, 255, 255, 0.02)',
      textPrimary: 'rgba(255, 255, 255, 0.87)',
      textSecondary: 'rgba(255, 255, 255, 0.60)',
      textMuted: 'rgba(255, 255, 255, 0.38)',
      accent: 'hsl(185, 70%, 55%)',
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

