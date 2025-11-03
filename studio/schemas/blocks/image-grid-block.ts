import { BiImages } from 'react-icons/bi'

export default {
  name: 'imageGridBlock',
  type: 'object',
  title: 'Image Grid Block',
  icon: BiImages,
  fields: [
    {
      name: 'carousel',
      type: 'boolean',
      title: 'Display as carousel',
      initialValue: false,
    },
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [{ type: 'image' }],
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Image Grid block' }),
  },
}
