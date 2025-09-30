import { BiCode } from 'react-icons/bi'

export default {
  name: 'embedBlock',
  type: 'object',
  title: 'Embed Block',
  icon: BiCode,
  fields: [
    {
      name: 'embed',
      type: 'text',
      title: 'Embed',
      description: 'Paste the embed code here',
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Embed block' }),
  },
}
