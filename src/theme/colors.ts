export const lightColors = {
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  border: '#d1d5db',
  divider: '#e5e7eb',
  primary: '#2563eb',
  danger: '#ef4444',
  chipBg: '#e5e7eb',
  placeholder: '#9ca3af',
  statusBar: 'dark' as const,
};

export const darkColors = {
  background: '#0f1115',
  surface: '#1a1d23',
  text: '#f3f4f6',
  textSecondary: '#9ca3af',
  border: '#374151',
  divider: '#2d3138',
  primary: '#3b82f6',
  danger: '#f87171',
  chipBg: '#2d3138',
  placeholder: '#6b7280',
  statusBar: 'light' as const,
};

export type ThemeColors = typeof lightColors;
