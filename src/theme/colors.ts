export const colors = {
  // Primary palette - Wisdom Blue (Brand)
  primary: {
    50: '#E8F3FC',
    100: '#C8E3F6',
    200: '#A5D2F0',
    300: '#7DB5E3',
    400: '#2563EB', // Better contrast blue (was Wisdom Blue)
    500: '#4A8BC7',
    600: '#3B77BA',
    700: '#2C63A7',
    800: '#1E4F94',
    900: '#0F3B81',
    main: '#2563EB', // Better contrast blue (was Wisdom Blue)
    light: '#E8F3FC',
    dark: '#2C63A7',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  },

  // Secondary palette - Warm Brown (Brand)
  secondary: {
    50: '#F7F1E8',
    100: '#EDE0C8',
    200: '#E3CFA5',
    300: '#D9BE82',
    400: '#CFB065',
    500: '#B8804F', // Main Warm Brown
    600: '#A67248',
    700: '#946441',
    800: '#82563A',
    900: '#704833',
    main: '#B8804F', // Warm Brown from brand guidelines
    light: '#F7F1E8',
    dark: '#82563A',
  },

  // Tertiary palette - Night Navy (Brand)
  tertiary: {
    50: '#F2F4F6',
    100: '#E2E6EA',
    200: '#CBD2D9',
    300: '#A8B4C0',
    400: '#7A8A9A',
    500: '#4F6374',
    600: '#3A4F5E',
    700: '#2C3E50', // Night Navy from brand guidelines
    800: '#243242',
    900: '#1C2834',
    main: '#2C3E50', // Night Navy from brand guidelines
    light: '#F2F4F6',
    dark: '#1C2834',
  },

  // Alert Orange (Brand)
  alert: {
    50: '#FFF4ED',
    100: '#FFE6D5',
    200: '#FFCDAA',
    300: '#FFAD74',
    400: '#FF8C42', // Alert Orange from brand guidelines
    500: '#FF7A33',
    600: '#E6621B',
    700: '#CC4A0B',
    800: '#B33E00',
    900: '#993300',
    main: '#FF8C42', // Alert Orange from brand guidelines
    light: '#FFF4ED',
    dark: '#B33E00',
  },

  // Cream (Brand)
  cream: {
    50: '#FFFEFB',
    100: '#FFFCF5',
    200: '#FFF9EC',
    300: '#FFF6E1',
    400: '#FFF4E6', // Cream from brand guidelines
    500: '#F2E6D3',
    600: '#E5D8C0',
    700: '#D8CAAD',
    800: '#CBBC9A',
    900: '#BEAE87',
    main: '#FFF4E6', // Cream from brand guidelines
    light: '#FFFEFB',
    dark: '#D8CAAD',
  },
  
  // Neutral palette - Gray with brand Soft Gray
  gray: {
    25: '#FCFCFD',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#95A5A6', // Soft Gray from brand guidelines
    600: '#82919C',
    700: '#6F7D92',
    800: '#5C6988',
    900: '#49557E',
  },
  
  // Text colors - using Night Navy and Soft Gray from brand
  text: {
    primary: '#2C3E50', // Night Navy from brand guidelines
    secondary: '#95A5A6', // Soft Gray from brand guidelines
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Background colors - using Cream from brand
  background: {
    main: '#FFF4E6', // Cream from brand guidelines
    paper: '#FFFFFF',
    light: '#FFFCF5',
    lighter: '#FFF9EC',
    dark: '#2C3E50', // Night Navy from brand guidelines
  },
  
  // Border colors
  border: {
    main: '#E5E7EB',
    light: '#F3F4F6',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
  
  // Semantic colors - Success Green (Brand)
  success: {
    50: '#F0F9F4',
    100: '#E0F2E9',
    200: '#C1E5D3',
    300: '#8CCAAD',
    400: '#57B087',
    500: '#27AE60', // Success Green from brand guidelines
    600: '#229954',
    700: '#1E8448',
    800: '#1A6F3C',
    900: '#165A30',
    main: '#27AE60', // Success Green from brand guidelines
    light: '#F0F9F4',
    dark: '#1E8448',
  },
  
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    main: '#EF4444',
    light: '#FEF2F2',
    dark: '#DC2626',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    main: '#F59E0B',
    light: '#FFFBEB',
    dark: '#D97706',
  },
  
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    main: '#3B82F6',
    light: '#EFF6FF',
    dark: '#2563EB',
  },
  
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    main: '#F97316',
    light: '#FFF7ED',
    dark: '#EA580C',
  },
  
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87',
    main: '#A855F7',
    light: '#FAF5FF',
    dark: '#9333EA',
  },
  
  // Status colors (backward compatibility)
  status: {
    error: {
      light: '#FEF2F2',
      border: '#FECACA',
      text: '#991B1B',
    },
    success: {
      light: '#F0FDF4',
      border: '#BBF7D0',
      text: '#166534',
    },
    warning: {
      light: '#FFFBEB',
      border: '#FDE68A',
      text: '#92400E',
    },
    info: {
      light: '#EFF6FF',
      border: '#BFDBFE',
      text: '#1E40AF',
    },
  },
  
  // Additional utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Type definitions
export type ColorPalette = typeof colors;
export type PrimaryColors = keyof typeof colors.primary;
export type GrayColors = keyof typeof colors.gray;