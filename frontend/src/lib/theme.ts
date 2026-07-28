export type ThemeMode = 'dark' | 'light';

const THEME_KEY = 'venturepilot_theme';

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(THEME_KEY) as ThemeMode;
  if (saved && (saved === 'dark' || saved === 'light')) {
    return saved;
  }
  return 'dark';
}

export function applyTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
  localStorage.setItem(THEME_KEY, theme);
}
