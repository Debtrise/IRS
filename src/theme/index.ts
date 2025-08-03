export { colors } from './colors';
export { spacing, radius, shadows, breakpoints, transitions } from './spacing';
export { typography } from './typography';

// Consolidated theme object
export const theme = {
  colors: require('./colors').colors,
  spacing: require('./spacing').spacing,
  radius: require('./spacing').radius,
  shadows: require('./spacing').shadows,
  breakpoints: require('./spacing').breakpoints,
  transitions: require('./spacing').transitions,
  typography: require('./typography').typography,
} as const;

export type Theme = typeof theme;