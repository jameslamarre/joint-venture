import type { Config } from 'tailwindcss'
import { SCREENS } from './src/globals'

const screens = Object.entries(SCREENS).reduce((acc, [key, value]) => {
  acc[key] = `${value}px`
  return acc
}, {})

export default {
  darkMode: ['class'],
  content: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        whitesmoke: '#F3F3F3',
        gray: '#EDEDED',
        darkgray: '#444',
        yellow: 'rgb(255, 242, 0)',
        blue: '#000DFF',
        red: 'rgb(255, 0, 255)',
      },
      textColor: {
        lightgray: '#999999',
        yellow: 'rgb(255, 242, 0)',
      },
      screens,
      fontFamily: {
        sans: ['"Wix"', 'Helvetica', 'Arial', 'sans-serif', 'arial-unicode'],
        sansMedia: [
          '"Media Sans"',
          'Helvetica',
          'Arial',
          'sans-serif',
          'arial-unicode',
        ],
        serif: ['Times', 'ui-serif', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular'],
      },
      fontSize: {
        base: ['clamp(1.125rem, 1rem + 0.465vw, 1.375rem)', '1.1'],
        '2xs': ['14px', '1'],
        xs: ['15px', '1.3'],
        sm: ['16px', '1'],
        md: ['clamp(1.125rem, 1rem + 0.465vw, 1.375rem)', '1.1'],
        lg: ['22px', '1'],
        xl: ['clamp(1.875rem, 1.6308rem + 0.93vw, 2.375rem)', '1'],
        '2xl': ['clamp(2.5rem, 2.1337rem + 1.395vw, 3.25rem)', '1'],
      },
      letterSpacing: {
        body: '-0.021em',
      },
      spacing: {
        x: 'var(--space-x)',
        xquarter: 'var(--space-x-quarter)',
        xhalf: 'var(--space-x-half)',
        xdouble: 'var(--space-x-double)',
        xtrio: 'var(--space-x-trio)',
        xquatro: 'var(--space-x-quatro)',
        xlg: 'var(--space-x-lg)',
        y: 'var(--space-y)',
        yhalf: 'var(--space-y-half)',
        yquarter: 'var(--space-y-quarter)',
        ydouble: 'var(--space-y-double)',
        ysm: 'var(--space-y-sm)',
        ylg: 'var(--space-y-lg)',
        input: 'var(--input-size)',
        block: 'var(--space-block)',
        btn: 'var(--btn-height)',
        btnWidth: 'var(--btn-width)',
        btnx: 'var(--btn-space-x)',
        btny: 'var(--btn-space-y)',
        header: 'var(--header-height)',
        app: 'var(--app)',
        wrap: 'var(--wrap)',
        wrapxs: 'var(--wrap-xs)',
        wrapsm: 'var(--wrap-sm)',
        page: 'var(--space-page)',
      },
      keyframes: {
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
      },
      animation: {
        fadeIn: 'fade-in 250ms linear forwards',
        fadeInDelay: 'fade-in 250ms linear 600ms forwards',
      },
      transitionDuration: {
        snail: 'var(--speed-snail)',
        xslow: 'var(--speed-xslow)',
        slow: 'var(--speed-slow)',
        normal: 'var(--speed-normal)',
        fast: 'var(--speed-fast)',
      },
      zIndex: {
        auto: 'auto',
        back: '-2',
        behind: '-1',
        base: '1',
        above: '2',
        header: '3',
        menu: '4',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('tailwindcss-animate'),
    ({ addComponents, theme }) => {
      addComponents({
        '.container': {
          paddingLeft: theme('spacing.x'),
          paddingRight: theme('spacing.x'),
          paddingBottom: theme('spacing.x'),
          width: '100%',
          maxWidth: '100%',
          '@screen md': {
            paddingLeft: theme('spacing.x'),
            paddingRight: theme('spacing.x'),
            paddingBottom: theme('spacing.x'),
          },
        },
        '.border-white': {
          border: '1px solid white',
        },
        '.border-black': {
          border: '1px solid black',
        },
        '.border-darkgray': {
          border: `1px solid ${theme('backgroundColor.darkgray')}`,
        },
        '.border-yellow': {
          border: `1px solid ${theme('backgroundColor.yellow')}`,
        },
        '.border-top': {
          borderTop: '1px solid black',
        },
        '.border-top--white': {
          borderTop: '1px solid white',
        },
        '.border-top--yellow': {
          borderTop: `1px solid ${theme('backgroundColor.yellow')}`,
        },
        '.border-left': {
          borderLeft: '1px solid black',
        },
        '.border-left--white': {
          borderLeft: '1px solid white',
        },
        '.border-right': {
          borderRight: '1px solid black',
        },
        '.border-right--white': {
          borderRight: '1px solid white',
          borderTop: 'none',
          borderBottom: 'none',
          borderLeft: 'none',
        },
        '.border-bottom': {
          borderBottom: '1px solid black',
        },
        '.border-bottom--white': {
          borderBottom: '1px solid white',
        },
        '.border-bottom--yellow': {
          borderBottom: `1px solid ${theme('backgroundColor.yellow')}`,
        },
        '.border-bottom--gray': {
          borderBottom: '1px solid #555',
        },
        '.text-h1': {
          fontSize: theme('fontSize.2xl'),
          fontFamily: theme('fontFamily.sansMedia'),
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        '.text-h2': {
          fontSize: theme('fontSize.xl'),
          fontFamily: theme('fontFamily.sansMedia'),
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        '.text-h3': {
          fontSize: theme('fontSize.lg'),
          fontFamily: theme('fontFamily.sansMedia'),
          letterSpacing: '0.05em',
        },
        '.text-h4': {
          fontSize: theme('fontSize.sm'),
          fontFamily: theme('fontFamily.sansMedia'),
          letterSpacing: '0.05em',
        },
      })
    },
  ],
} satisfies Config
