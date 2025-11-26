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
      sans: "'Inter', sans-serif",
      display: "'Outfit', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep greens with emerald accents',
    colors: {
      bgPrimary: '#0a1410',
      bgSecondary: '#0f1f18',
      bgTertiary: '#142a20',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      textPrimary: '#d1fae5',
      textSecondary: '#a7d7c5',
      textMuted: '#5e9980',
      accent: '#34d399',
      accentGlow: 'rgba(52, 211, 153, 0.5)',
      accentMuted: 'rgba(52, 211, 153, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
    },
    fonts: {
      sans: "'Inter', sans-serif",
      display: "'Outfit', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    description: 'Arctic, bluish calm palette',
    colors: {
      bgPrimary: '#2e3440',
      bgSecondary: '#3b4252',
      bgTertiary: '#434c5e',
      bgGlow: 'rgba(136, 192, 208, 0.15)',
      textPrimary: '#eceff4',
      textSecondary: '#d8dee9',
      textMuted: '#7b88a1',
      accent: '#88c0d0',
      accentGlow: 'rgba(136, 192, 208, 0.5)',
      accentMuted: 'rgba(136, 192, 208, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#a3be8c',
      warning: '#ebcb8b',
      error: '#bf616a',
    },
    fonts: {
      sans: "'Inter', sans-serif",
      display: "'Outfit', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'mono',
    name: 'Monochrome',
    description: 'Pure grayscale minimalism',
    colors: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#141414',
      bgTertiary: '#1f1f1f',
      bgGlow: 'rgba(255, 255, 255, 0.05)',
      textPrimary: '#fafafa',
      textSecondary: '#a3a3a3',
      textMuted: '#525252',
      accent: '#e5e5e5',
      accentGlow: 'rgba(255, 255, 255, 0.3)',
      accentMuted: 'rgba(255, 255, 255, 0.05)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#a3a3a3',
      warning: '#d4d4d4',
      error: '#737373',
    },
    fonts: {
      sans: "'Inter', sans-serif",
      display: "'Inter', sans-serif",
      mono: "'Manrope', monospace",
    },
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    description: 'Aurora borealis inspired greens & purples',
    colors: {
      bgPrimary: '#0d1117',
      bgSecondary: '#161b22',
      bgTertiary: '#21262d',
      bgGlow: 'rgba(88, 166, 255, 0.12)',
      textPrimary: '#e6edf3',
      textSecondary: '#8b949e',
      textMuted: '#6e7681',
      accent: '#58d68d',
      accentGlow: 'rgba(88, 214, 141, 0.5)',
      accentMuted: 'rgba(88, 214, 141, 0.1)',
      borderLight: 'rgba(255, 255, 255, 0.05)',
      borderMedium: 'rgba(255, 255, 255, 0.1)',
      success: '#58d68d',
      warning: '#d29922',
      error: '#f85149',
    },
    fonts: {
      sans: "'Inter', sans-serif",
      display: "'Outfit', sans-serif",
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
