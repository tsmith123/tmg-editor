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
        const writer = new UpcastWriter(viewDocument)

        const children = data.content.getChildren()
        console.log(children)

        for (const child of children) {
          const isCurrent = child.is('element', 'br')
          const isPrev = child.previousSibling && child.previousSibling.is('element', 'br')
          const isNext = child.nextSibling && child.nextSibling.is('element', 'br')

          if (!isCurrent) {
            console.log(child.data())
          }

          // If single br tag found then remove it
          if (isCurrent && !isPrev && !isNext) {
            const childIndex = data.content.getChildIndex(child)

            writer.remove(child)

            writer.insertChild(childIndex, child.getChildren(), data.content)
          }
        }
      },
      { priority: 'high' }
    )
  }
}