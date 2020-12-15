import React from 'react'
import ReactDOM from 'react-dom'

// CKEditor 5
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

// CKEditor 5 Plugins
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials'
import Heading from '@ckeditor/ckeditor5-heading/src/heading'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic'
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough'
import List from '@ckeditor/ckeditor5-list/src/list'
import Link from '@ckeditor/ckeditor5-link/src/link'
import AutoLink from '@ckeditor/ckeditor5-link/src/autolink'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript.js'
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js'
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters.js'
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'

// Our Plugins
import MediaPlugin from './plugins/media'

import TestPlugin from './plugins/test'
const TestPluginInstance = new TestPlugin()
const Test = TestPluginInstance.build('Param 1')

export const Editor = ({ placeholder, data, onInit, onChange, plugin }) => {
  const config = {
    placeholder,
    toolbar: ['bold', 'italic', 'strikethrough', 'superscript', '|', 'link', 'blockQuote', '|', 'numberedList', 'bulletedList', '|', 'heading', '|', 'specialCharacters', 'removeFormat', '|', 'undo', 'redo', '|', 'test'],
    plugins: [
      AutoLink,
      BlockQuote,
      Bold,
      Essentials,
      Heading,
      Italic,
      Link,
      List,
      MediaPlugin,
      PasteFromOffice,
      Paragraph,
      RemoveFormat,
      Strikethrough,
      SpecialCharacters,
      SpecialCharactersEssentials,
      Superscript,
      Test
    ],
    heading: {
      options: [
        { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
        { model: 'heading3', view: 'h3', title: 'Large', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Medium', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Medium + Line', class: 'ck-heading_heading5' }
      ]
    },
    link: {
      defaultProtocol: 'http://',
      decorators: {
        addTargetToExternalLinks: {
          mode: 'manual',
          label: 'no-follow commercial link',
          defaultValue: false,
          attributes: {
            rel: 'nofollow'
          }
        }
      }
    },
    media: {
      renderer: (props, domElement) => {
        const { id } = props
        const Component = plugin.view

        const { onSwap, onReplace } = plugin.props

        const handlers = {
          onSwap: () => onSwap(id),
          onReplace: () => onReplace(id)
        }

        ReactDOM.render(<Component {...props} {...handlers} />, domElement)
      }
    }
  }

  const handleOnInit = editor => {
    onInit && onInit(editor)
  }

  const handleOnChange = (ev, editor) => {
    const data = editor.getData()
    onChange && onChange(data)
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      config={config}
      onInit={handleOnInit}
      onChange={handleOnChange}
    />
  )
}
