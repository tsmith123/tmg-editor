import { Plugin } from 'ckeditor5/src/core'
import { ClipboardPipeline } from 'ckeditor5/src/clipboard'
import { UpcastWriter } from 'ckeditor5/src/engine'

export default class Paste extends Plugin {
  static get pluginName () {
    return 'PasteSpecial'
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
        console.log('Data', data)
        console.log('Content', data.content)
        const writer = new UpcastWriter(viewDocument)

        for (const child of data.content.getChildren()) {
          console.log('Child', child)
          // if (child.is('element', 'b') && child.getStyle('font-weight') === 'normal') {
          //   const childIndex = data.content.getChildIndex(child)

          //   writer.remove(child)
          //   writer.insertChild(childIndex, child.getChildren(), documentFragment)
          // }
        }
      },
      { priority: 'high' }
    )
  }
}
