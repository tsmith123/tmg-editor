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
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle'
import Link from '@ckeditor/ckeditor5-link/src/link'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice'

const Editor = ({ onChange, data, placeholder }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      config={{
        placeholder,
        plugins: [Link, BlockQuote, ListStyle, PasteFromOffice, Heading, Essentials, Paragraph, Bold, Italic, Strikethrough],
        toolbar: ['heading', '|', 'bold', 'italic', 'strikethrough', '|', 'link', 'blockQuote', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
      }}
      onChange={(event, editor) => {
        const data = editor.getData()
        onChange(data)
      }}
    />
  )
}

export default Editor
