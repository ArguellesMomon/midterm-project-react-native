import { Theme } from '../types';

export const lightTheme: Theme = {
  colors: {
    primary: '#007AFF',
    primaryDark: '#0051D5',
    primaryLight: '#4DA3FF',
    secondary: '#5AC8FA',
    background: '#F8F9FA',
    backgroundGradientStart: '#FFFFFF',
    backgroundGradientEnd: '#F0F2F5',
    surface: '#FFFFFF',
    surfaceElevated: '#FAFBFC',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E8EAED',
    borderLight: '#F1F3F5',
    success: '#34C759',
    successLight: '#E8F8EC',
    error: '#FF3B30',
    errorLight: '#FFEBE9',
    warning: '#FF9500',
    warningLight: '#FFF4E6',
    info: '#007AFF',
    infoLight: '#E5F2FF',
    // Card gradients
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#F9FAFB',
    // Accent colors
    accent: '#7C3AED',
    accentLight: '#F3E8FF',
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
    primary: '#FF9F0A',        // Orange primary
    primaryDark: '#E08A00',    // Darker orange
    primaryLight: '#FFB340',   // Lighter orange
    secondary: '#FF6B35',      // Coral orange
    background: '#0A0A0B',
    backgroundGradientStart: '#0F0F10',
    backgroundGradientEnd: '#1A1A1D',
    surface: '#1C1C1E',
    surfaceElevated: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#A1A1A6',
    textTertiary: '#6E6E73',
    border: '#2C2C2E',
    borderLight: '#38383A',
    success: '#32D74B',
    successLight: '#1A3A25',
    error: '#FF453A',
    errorLight: '#3D1F1E',
    warning: '#FF9F0A',
    warningLight: '#3D2E1A',
    info: '#0A84FF',
    infoLight: '#1A2A3D',
    // Card gradients with orange tint
    cardGradientStart: '#1C1C1E',
    cardGradientEnd: '#252527',
    // Accent colors
    accent: '#BF5AF2',
    accentLight: '#2D1F3D',
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