import { RxDividerHorizontal } from 'react-icons/rx'

export default {
  name: 'dividerBlock',
  type: 'object',
  title: 'Divider Block',
  icon: RxDividerHorizontal,
  fields: [
    {
      name: 'border',
      title: 'border',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Divider block' }),
  },
}
