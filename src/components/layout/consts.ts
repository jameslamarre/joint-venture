import { ThemeName } from './types'

const THEME_CSS_VARS: Record<ThemeName, Record<string, string>> = {
  stone: {
    '--theme-bg': '#A59F8D',
    '--theme-text': '#000000',
    '--theme-text--menu': '#A59F8D',
    '--theme-text--tables': '#000',
    '--theme-text--action-hover': '#000',
    '--theme-menu': '#000',
    '--theme-highlight': '#CFE806',
  },
  yellow: {
    '--theme-bg': '#CFE806',
    '--theme-text': '#000',
    '--theme-text--menu': '#CFE806',
    '--theme-text--tables': '#000',
    '--theme-text--action-hover': '#000',
    '--theme-menu': '#000',
    '--theme-highlight': '#CFE806',
  },
  blue: {
    '--theme-bg': '#91D2DA',
    '--theme-text': '#000',
    '--theme-text--menu': '#91D2DA',
    '--theme-text--tables': '#000',
    '--theme-text--action-hover': '#000',
    '--theme-menu': '#000',
    '--theme-highlight': '#FFF',
  },
  dark: {
    '--theme-bg': '#31383C',
    '--theme-text': '#fff',
    '--theme-text--menu': '#31383C',
    '--theme-text--tables': '#000',
    '--theme-text--action-hover': '#000',
    '--theme-menu': '#fff',
    '--theme-highlight': '#A90736',
  },
}

export default THEME_CSS_VARS
