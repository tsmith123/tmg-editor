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
        console.log('Content', data.content)
        const writer = new UpcastWriter(viewDocument)

        const children = data.content.getChildren()

        for (const child of children) {
          const isMidParagraphBreak = child.is('element', 'br')
          console.log(isMidParagraphBreak)

          const childIndex = data.content.getChildIndex(child)

          writer.remove(child)
          writer.insertChild(childIndex, child.getChildren(), data.content)

          console.log(child.nextSibling)
        }
      },
      { priority: 'high' }
    )
  }
}
