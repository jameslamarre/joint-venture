/* eslint-disable import/no-anonymous-default-export */
import { BiCode } from 'react-icons/bi'
import { GiButtonFinger } from 'react-icons/gi'
import { GrImage } from 'react-icons/gr'
import { RxDividerHorizontal } from 'react-icons/rx'
import {
  LuAlignLeft,
  LuCircle,
  LuHighlighter,
  LuUnderline,
} from 'react-icons/lu'

const HighlightDecorator = (props: any) => {
  return <span style={{ backgroundColor: '#CFE806' }}>{props.children}</span>
}

const RedUnderlineDecorator = (props: any) => {
  return (
    <span style={{ textDecoration: 'underline', textDecorationColor: 'red' }}>
      {props.children}
    </span>
  )
}

const RedCircleDecorator = (props: any) => {
  return (
    <span style={{ border: '1px solid red', borderRadius: '50%' }}>
      {props.children}
    </span>
  )
}

export default {
  name: 'richText',
  type: 'array',
  title: 'Rich Text',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
      ],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          {
            title: 'Highlight',
            value: 'highlight',
            icon: LuHighlighter,
            component: HighlightDecorator,
          },
          {
            title: 'Red Underline',
            value: 'redUnderline',
            icon: LuUnderline,
            component: RedUnderlineDecorator,
          },
          {
            title: 'Red Circle',
            value: 'redCircle',
            icon: LuCircle,
            component: RedCircleDecorator,
          },
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'link',
          },
          {
            title: 'Alignment',
            name: 'alignment',
            type: 'object',
            icon: LuAlignLeft,
            fields: [
              {
                title: 'Align',
                name: 'align',
                type: 'string',
                options: {
                  list: [
                    { title: 'Left', value: 'left' },
                    { title: 'Center', value: 'center' },
                    { title: 'Right', value: 'right' },
                  ],
                  layout: 'radio',
                },
              },
            ],
          },
        ],
      },
      of: [
        {
          title: 'Divider',
          name: 'divider',
          type: 'divider',
          icon: RxDividerHorizontal,
        },
        {
          title: 'Embed',
          name: 'embed',
          type: 'embed',
          icon: BiCode,
        },
      ],
    },
    {
      title: 'Media',
      name: 'media',
      type: 'media',
      blockEditor: {
        icon: GrImage,
      },
    },
    {
      title: 'CTA',
      name: 'cta',
      type: 'cta',
      blockEditor: {
        icon: GiButtonFinger,
      },
    },
  ],
}
