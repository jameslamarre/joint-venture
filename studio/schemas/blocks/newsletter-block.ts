import { LuTextCursorInput } from 'react-icons/lu'

export default {
  title: 'Newsletter Block',
  name: 'newsletterBlock',
  icon: LuTextCursorInput,
  type: 'object',
  fields: [
    {
      name: 'header',
      type: 'string',
      title: 'Header',
    },
    {
      name: 'urlSubmit',
      type: 'string',
      title: 'URL Submit',
      descriotion:
        'URL to submit form data to minus the form ID/GUID and API key',
    },
    {
      name: 'audienceId',
      type: 'string',
      title: 'Audience ID/Form GUID',
    },
    {
      name: 'successMessage',
      type: 'richText',
      title: 'Success Message',
    },
  ],
  preview: {
    prepare: (): { title: string } => ({ title: 'Newsletter block' }),
  },
}
