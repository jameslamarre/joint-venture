import richText from './objects/rich-text'
import plainText from './objects/plain-text'
import blockContent from './objects/block-content'
import textBlock from './blocks/text-block'
import color from './objects/color'
import link from './objects/link'
import cta from './objects/cta'
import media from './objects/media'
import figure from './objects/figure'
import menuItem from './objects/menu-item'
import seo from './objects/seo'
import page from './documents/page'
import menus from './documents/menus'
import siteSettings from './documents/site-settings'
import video from './objects/video'
import divider from './objects/divider'
import embed from './objects/embed'
import figuresBlock from './blocks/figures-block'
import dividerBlock from './blocks/divider-block'
import vimeo from './objects/vimeo'
import youtube from './objects/youtube'
import mediaBlock from './blocks/media-block'
import accordionBlock from './blocks/accordion-block'
import accordion from './objects/accordion'
import project from './documents/project'
import projectsBlock from './blocks/projects-block'
import embedBlock from './blocks/embed-block'
import textAndImageBlock from './blocks/text-and-image-block'

export const schemaTypes = [
  // objects
  link,
  accordion,
  color,
  cta,
  divider,
  embed,
  figure,
  media,
  menuItem,
  seo,
  richText,
  plainText,
  video,
  vimeo,
  youtube,

  // modules

  // blocks
  blockContent,
  accordionBlock,
  dividerBlock,
  embedBlock,
  figuresBlock,
  mediaBlock,
  projectsBlock,
  textBlock,
  textAndImageBlock,

  // documents
  menus,
  page,
  project,
  siteSettings,
]

export default schemaTypes
