import { Theme } from '../types';

export const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5AC8FA',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#6B7280',
    border: '#E5E5EA',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
  },
  fonts: {
    body: 'System',
    heading: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

export const darkTheme: Theme = {
  colors: {
    primary: '#0A84FF',
    secondary: '#64D2FF',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: '#38383A',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
  },
  fonts: {
    body: 'System',
    heading: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};