import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TEAMS } from '../data/teams';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  favoriteTeam: string | null;
  setFavoriteTeam: (teamId: string | null) => void;
  accentColor: string;
}

const DEFAULT_ACCENT = '#E10600';

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  toggleTheme: () => {},
  favoriteTeam: null,
  setFavoriteTeam: () => {},
  accentColor: DEFAULT_ACCENT,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('f1guide_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [favoriteTeam, setFavoriteTeam] = useState<string | null>(() => {
    return localStorage.getItem('f1guide_favorite_team');
  });

  const accentColor = favoriteTeam
    ? TEAMS.find(t => t.id === favoriteTeam)?.color || DEFAULT_ACCENT
    : DEFAULT_ACCENT;

  useEffect(() => {
    localStorage.setItem('f1guide_theme', darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (favoriteTeam) {
      localStorage.setItem('f1guide_favorite_team', favoriteTeam);
    } else {
      localStorage.removeItem('f1guide_favorite_team');
    }

    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--accent-hover', lightenColor(accentColor, 20));
    document.documentElement.style.setProperty('--accent-muted', `${accentColor}14`);
    document.documentElement.style.setProperty('--accent-glow', `${accentColor}40`);
    document.documentElement.style.setProperty('--border-glow-dim', `${accentColor}4D`);
  }, [favoriteTeam, accentColor]);

  const toggleTheme = () => setDarkMode(d => !d);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, favoriteTeam, setFavoriteTeam, accentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
  const b = Math.min(255, (num & 0x0000ff) + percent);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
