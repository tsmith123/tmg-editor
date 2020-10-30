import React from 'react'

import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'

// /* CKEditor Plugins */
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
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'

const Editor = ({ onChange, data, placeholder }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      config={{
        placeholder,
        plugins: [
          AutoLink,
          BlockQuote,
          Bold,
          Essentials,
          Heading,
          Italic,
          Link,
          List,
          PasteFromOffice,
          Paragraph,
          Strikethrough,
          Superscript
        ],
        heading: {
          options: [
            { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
            { model: 'heading3', view: 'h3', title: 'Large', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Medium', class: 'ck-heading_heading4' }
          ]
        },
        toolbar: ['bold', 'italic', 'strikethrough', 'superscript', '|', 'link', 'blockQuote', '|', 'bulletedList', 'numberedList', '|', 'heading', '|', 'undo', 'redo']
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        onChange(data)
      }}
    />
  )
}

export default Editor
