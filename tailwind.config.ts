import type { Config } from 'tailwindcss'
import { SCREENS } from './src/globals'

const screens = Object.entries(SCREENS).reduce((acc, [key, value]) => {
  acc[key] = `${value}px`
  return acc
}, {} as Record<string, string>)

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
        stone: '#A59F8D',
        darkgray: '#31383C',
        yellow: '#CFE806',
        blue: '#91D2DA',
        red: '#A90736',
      },
      textColor: {
        red: '#A90736',
        black: '#000',
        stone: '#A59F8D',
        blue: '#91D2DA',
        yellow: '#CFE806',
        textColor: 'var(--theme-text)',
        textColorTables: 'var(--theme-text--tables)',
        textColorActionHover: 'var(--theme-text--action-hover)',
      },
      fill: {
        red: '#A90736',
        black: '#000',
        stone: '#A59F8D',
        blue: '#91D2DA',
      },
      stroke: {
        red: '#A90736',
        black: '#000',
        stone: '#A59F8D',
        blue: '#91D2DA',
      },
      screens,
      fontFamily: {
        sans: [
          '"Monument"',
          'Helvetica',
          'Arial',
          'sans-serif',
          'arial-unicode',
        ],
        serif: ['"Cardone"', 'Times', 'ui-serif', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular'],
      },
      fontSize: {
        xs: ['var(--font-size-xs)', '1.3'],
        sm: ['var(--font-size-sm)', '1'],
        base: ['var(--font-size-base)', '1.3'],
        baseSerif: ['var(--font-size-base--serif)', '0'],
        md: ['var(--font-size-md)', '1.25'],
        lg: ['var(--font-size-lg)', '1'],
        xl: ['var(--font-size-xl)', '1'],
        '2xl': ['var(--font-size-2xl)', '1'],
        '3xl': ['var(--font-size-3xl)', '1'],
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
        ytrio: 'var(--space-y-trio)',
        yquad: 'var(--space-y-quad)',
        ysm: 'var(--space-y-sm)',
        ylg: 'var(--space-y-lg)',
        input: 'var(--input-size)',
        block: 'var(--space-block)',
        btn: 'var(--btn-height)',
        btnWidth: 'var(--btn-width)',
        btnx: 'var(--btn-space-x)',
        btny: 'var(--btn-space-y)',
        header: 'var(--header-height)',
        container: 'var(--container)',
        app: 'var(--app)',
        microsite: 'var(--microsite)',
        wrap: 'var(--wrap)',
        textWrap: 'var(--text-wrap)',
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
        alert: '5',
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
    ({ addComponents, theme }: { addComponents: any; theme: any }) => {
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
        '.border-stone': {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme('colors.stone'),
        },
        '.border-black': {
          border: '1px solid black',
        },
        '.border-top': {
          borderTop: '1px solid black',
        },
        '.border-top--white': {
          borderTop: '1px solid white',
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
        '.text-super': {
          fontSize: theme('fontSize.3xl'),
          fontFamily: theme('fontFamily.sans'),
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        '.text-h1': {
          fontSize: theme('fontSize.2xl'),
          fontFamily: theme('fontFamily.sans'),
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        '.text-h2': {
          fontSize: theme('fontSize.xl'),
          fontFamily: theme('fontFamily.sans'),
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        '.text-h3': {
          fontSize: theme('fontSize.lg'),
          fontFamily: theme('fontFamily.sans'),
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        '.text-h4': {
          fontSize: theme('fontSize.sm'),
          fontFamily: theme('fontFamily.sans'),
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
      })
    },
  ],
} satisfies Config
