import { BiImage } from 'react-icons/bi'

export default {
  name: 'micrositeBlock',
  type: 'object',
  title: 'Microsite Block',
  icon: BiImage,
  fields: [
    {
      name: 'backgroundImage',
      type: 'image',
      title: 'Background Image',
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Microsite block' }),
  },
}
