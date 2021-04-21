import React from 'react'
import ReactDOM from 'react-dom'

// CKEditor 5
import { CKEditor } from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor'

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
import WordCount from '@ckeditor/ckeditor5-word-count/src/wordcount'

// Our Plugins
import Media from './plugins/media'
import Frame from './plugins/frame'
import Image from './plugins/image'
import Video from './plugins/video'
import Html from './plugins/html'

export const Editor = ({
  placeholder,
  data,
  onReady,
  onClick,
  onChange,
  onMove,
  plugins,
  ...rest
}) => {
  const config = {
    placeholder,
    toolbar: {
      items: ['bold', 'italic', 'strikethrough', 'superscript', '|', 'link', 'blockQuote', '|', 'numberedList', 'bulletedList', '|', 'heading', '|', 'image', 'video', 'html', '|', 'specialCharacters', 'removeFormat', '|', 'undo', 'redo', '|'],
      viewportTopOffset: 130,
      shouldNotGroupWhenFull: true
    },
    plugins: [
      AutoLink,
      BlockQuote,
      Bold,
      Essentials,
      Frame,
      Heading,
      Html,
      Image,
      Italic,
      Link,
      List,
      Media,
      PasteFromOffice,
      Paragraph,
      RemoveFormat,
      Strikethrough,
      SpecialCharacters,
      SpecialCharactersEssentials,
      Superscript,
      Video,
      WordCount
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
      renderer: (attr, domElement) => {
        const { type, src, props } = attr
        const Component = plugins[type]

        const methods = {
          onSwapWithLead: () => onMove({ type, src, props, action: 'swapWithLead' }),
          onUseAsLead: () => onMove({ type, src, props, action: 'useAsLead' }),
          onReplace: () => onClick(type, { target: 'body' }), // opens image or video modal in app
          onEdit: () => onClick('meta', { src, props }), // opens meta modal in app
          onEditCrop: () => onClick('crop', { src, props, target: 'body' }), // opens cropping modal in app
          ...rest
        }

        ReactDOM.render(<Component {...attr} {...methods} />, domElement)
      },
      handler: type => {
        onClick && onClick(type, { target: 'body' })
      }
    },
    frame: {
      renderer: (props, domElement) => {
        const Component = plugins.html

        const methods = {
          onEdit: () => onClick('html', { value: props.html })
        }

        ReactDOM.render(<Component {...props} {...methods} />, domElement)
      }
    }
  }

  // As this is the decoupled editor
  // This is needed to render the toolbar
  const handleOnReady = editor => {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    )

    onReady && onReady(editor)
  }

  const handleOnChange = (ev, editor) => {
    const data = editor.getData()

    onChange && onChange(data)
  }

  return (
    <CKEditor
      editor={DecoupledEditor}
      data={data}
      config={config}
      onReady={handleOnReady}
      onChange={handleOnChange}
    />
  )
}
