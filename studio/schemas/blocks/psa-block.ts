import { ImEmbed } from 'react-icons/im'

export default {
  name: 'psaBlock',
  type: 'object',
  title: 'PSA Block',
  icon: ImEmbed,
  fields: [
    {
      name: 'showPsa',
      title: 'Show PSA',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'PSA block' }),
  },
}
