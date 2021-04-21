import { Plugin } from 'ckeditor5/src/core'
import { ClipboardPipeline } from 'ckeditor5/src/clipboard'
import { UpcastWriter } from 'ckeditor5/src/engine'

export default class Paste extends Plugin {
  static get pluginName () {
    return 'PasteFromOffice'
  }

  static get requires () {
    return [ClipboardPipeline]
  }

  init () {
    const editor = this.editor
    const viewDocument = editor.editing.view.document

    editor.plugins.get('ClipboardPipeline').on(
      'inputTransformation',
      (evt, data) => {
        const htmlString = data.dataTransfer.getData('text/html')
        console.log(htmlString)

        const writer = new UpcastWriter(this.document)

        console.log('Writer', writer)
      },
      { priority: 'high' }
    )
  }
}
