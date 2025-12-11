import { TbColumns } from 'react-icons/tb'

export default {
  name: 'doubleColumnBlock',
  type: 'object',
  title: 'Double Column Block',
  icon: TbColumns,
  fields: [
    {
      name: 'columnOne',
      type: 'richText',
      title: 'Text',
    },
    {
      name: 'columnTwo',
      type: 'richText',
      title: 'Text',
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Double Column block' }),
  },
}
