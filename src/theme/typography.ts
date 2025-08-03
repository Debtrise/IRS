export const typography = {
  fontFamily: {
    // Elegant professional fonts
    heading: "'Playfair Display', Georgia, 'Times New Roman', serif", // Elegant serif for headings
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif", // Modern readable sans-serif
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif", // Default fallback
    mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  
  // Pre-composed text styles - Brand Guidelines
  textStyles: {
    // Headings - Montserrat Bold
    h1: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '3rem', // 48px (brand: 32-48px)
      fontWeight: '700', // Montserrat Bold
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '2rem', // 32px (brand: 24-32px)
      fontWeight: '700', // Montserrat Bold
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '1.5rem', // 24px (brand: 20-24px)
      fontWeight: '400', // Montserrat Regular
      lineHeight: '1.375',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.5',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: '600',
      lineHeight: '1.5',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: '600',
      lineHeight: '1.5',
    },
    
    // Body text - Open Sans Regular
    bodyLarge: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '1.125rem',
      fontWeight: '400', // Open Sans Regular
      lineHeight: '1.75',
    },
    bodyBase: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '1rem', // 16px (brand guideline)
      fontWeight: '400', // Open Sans Regular
      lineHeight: '1.5',
    },
    bodySmall: {
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '0.875rem', // 14px (brand small text)
      fontWeight: '400', // Open Sans Regular
      lineHeight: '1.5',
    },
    
    // UI text
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1.25',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
    
    // Button text
    button: {
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
    buttonSmall: {
      fontSize: '0.875rem',
      fontWeight: '500',
      lineHeight: '1.25',
      letterSpacing: '0.025em',
    },
  },
} as const;

export type TextStyle = keyof typeof typography.textStyles;