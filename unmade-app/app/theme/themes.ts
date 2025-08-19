import { colors, spacing, borderRadius, typography, shadows } from './tokens';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    primaryBackground: string;
    secondary: string;
    secondaryBackground: string;
    accent: string;
    accentBackground: string;
    border: string;
    borderLight: string;
    success: string;
    successBackground: string;
    warning: string;
    warningBackground: string;
    error: string;
    errorBackground: string;
    overlay: string;
  };
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  shadows: typeof shadows;
}

export const lightTheme: Theme = {
  colors: {
    background: colors.gray[50],
    surface: '#ffffff',
    surfaceSecondary: colors.gray[100],
    text: colors.gray[900],
    textSecondary: colors.gray[700],
    textMuted: colors.gray[500],
    primary: colors.portal[600],
    primaryBackground: colors.portal[50],
    secondary: colors.morty[500],
    secondaryBackground: colors.morty[50],
    accent: colors.rick[500],
    accentBackground: colors.rick[50],
    border: colors.gray[200],
    borderLight: colors.gray[100],
    success: colors.success[600],
    successBackground: colors.success[50],
    warning: colors.warning[500],
    warningBackground: colors.warning[50],
    error: colors.error[500],
    errorBackground: colors.error[50],
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  spacing,
  borderRadius,
  typography,
  shadows,
};

export const darkTheme: Theme = {
  colors: {
    background: colors.gray[900],
    surface: colors.gray[800],
    surfaceSecondary: colors.gray[700],
    text: colors.gray[50],
    textSecondary: colors.gray[200],
    textMuted: colors.gray[400],
    primary: colors.portal[400],
    primaryBackground: colors.portal[900],
    secondary: colors.morty[400],
    secondaryBackground: colors.morty[900],
    accent: colors.rick[400],
    accentBackground: colors.rick[900],
    border: colors.gray[600],
    borderLight: colors.gray[700],
    success: colors.success[500],
    successBackground: colors.success[500] + '20', // 20% opacity
    warning: colors.warning[500],
    warningBackground: colors.warning[500] + '20',
    error: colors.error[500],
    errorBackground: colors.error[500] + '20',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
  spacing,
  borderRadius,
  typography,
  shadows,
};
