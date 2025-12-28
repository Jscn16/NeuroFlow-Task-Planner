export interface Theme {
  id: string;
  name: string;
  description: string;
  isLight?: boolean; // true for light themes, false/undefined for dark
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
    description: 'Aurora borealis inspired blues & purples',
    colors: {
      bgPrimary: '#0d1117',
      bgSecondary: '#161b22',
      bgTertiary: '#21262d',
      bgGlow: 'rgba(88, 166, 255, 0.12)',
      textPrimary: 'rgba(255, 255, 255, 0.87)',
      textSecondary: 'rgba(255, 255, 255, 0.60)',
      textMuted: 'rgba(255, 255, 255, 0.38)',
      accent: 'hsl(220, 70%, 55%)',
      accentGlow: 'rgba(88, 166, 255, 0.5)',
      accentMuted: 'rgba(88, 166, 255, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#3fb950',
      warning: '#d29922',
      error: '#f85149',
    },
    fonts: {
      sans: "'Lexend', 'Manrope', sans-serif",
      display: "'Lexend', 'Manrope', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'neuroflow',
    name: 'NeuroFlow',
    description: 'Default dark navy with cyan accents',
    colors: {
      bgPrimary: '#121212',
      bgSecondary: '#1C1C1E',
      bgTertiary: '#242428',
      bgGlow: 'rgba(56, 189, 248, 0.15)',
      textPrimary: 'rgba(255, 255, 255, 0.87)',
      textSecondary: 'rgba(255, 255, 255, 0.60)',
      textMuted: 'rgba(255, 255, 255, 0.38)',
      accent: 'hsl(185, 70%, 55%)',
      accentGlow: 'rgba(6, 182, 212, 0.5)',
      accentMuted: 'rgba(6, 182, 212, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },
    fonts: {
      sans: "'Lexend', 'Manrope', sans-serif",
      display: "'Lexend', 'Manrope', sans-serif",
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
      sans: "'Lexend', 'Manrope', sans-serif",
      display: "'Lexend', 'Manrope', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'daylight',
    name: 'Daylight',
    description: 'Clean, bright light mode inspired by modern design',
    isLight: true,
    colors: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f5f5f7',
      bgTertiary: '#e8e8ed',
      bgGlow: 'rgba(0, 122, 255, 0.08)',
      textPrimary: 'rgba(0, 0, 0, 0.87)',
      textSecondary: 'rgba(0, 0, 0, 0.55)',
      textMuted: 'rgba(0, 0, 0, 0.35)',
      accent: '#007aff',
      accentGlow: 'rgba(0, 122, 255, 0.25)',
      accentMuted: 'rgba(0, 122, 255, 0.08)',
      borderLight: 'rgba(0, 0, 0, 0.06)',
      borderMedium: 'rgba(0, 0, 0, 0.12)',
      success: '#34c759',
      warning: '#ff9500',
      error: '#ff3b30',
    },
    fonts: {
      sans: "'-apple-system', 'SF Pro Text', 'Lexend', system-ui, sans-serif",
      display: "'-apple-system', 'SF Pro Display', 'Lexend', system-ui, sans-serif",
      mono: "'SF Mono', 'Menlo', monospace",
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

  // Set theme mode as data attribute for CSS selectors (light/dark)
  root.setAttribute('data-theme', theme.isLight ? 'light' : 'dark');
  root.setAttribute('data-theme-id', theme.id);
};

