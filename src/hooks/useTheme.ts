import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';

export function useTheme(): { colors: ThemeColors; mode: 'light' | 'dark'; toggleTheme: () => void } {
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const colors = mode === 'dark' ? darkColors : lightColors;
  return { colors, mode, toggleTheme };
}
