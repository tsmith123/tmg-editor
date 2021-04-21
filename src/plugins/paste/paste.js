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
        console.log(data)
        console.log(data.content)

        const htmlString = data.dataTransfer.getData('text/html')
        console.log(htmlString)

        const writer = new UpcastWriter(viewDocument)

        const children = data.content.getChildren()

        for (const child of children) {
          const isCurrent = child.is('element', 'br')
          const isPrev = child.previousSibling && child.previousSibling.is('element', 'br')
          const isNext = child.nextSibling && child.nextSibling.is('element', 'br')

          // If single br tag found then remove it
          if (isCurrent && !isPrev && !isNext) {
            const childIndex = data.content.getChildIndex(child)

            writer.remove(child)
            writer.merge(childIndex)

            writer.insertChild(childIndex, child.getChildren(), data.content)
          }
        }
      },
      { priority: 'high' }
    )
  }
}
