import { textField } from './fields'
import { LuHighlighter } from 'react-icons/lu'

export default {
  name: 'scrollingTextBlock',
  type: 'object',
  title: 'Scrolling Text Block',
  icon: LuHighlighter,
  fields: [textField],
  preview: {
    prepare: (): { title: string } => ({ title: 'Scrolling Text Block' }),
  },
}
