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

        console.log(data.content)
        const children = data.content.getChildren()

        let count = 0
        for (const child of children) {
          count = count + 1
          const isCurrent = child.is('element', 'br')
          const isPrev = child.previousSibling && child.previousSibling.is('element', 'br')
          const isNext = child.nextSibling && child.nextSibling.is('element', 'br')

          if (count === 1) {
            child.data = 'Testing '
          }

          if (count === 2) {
            writer.remove(child)
          }

          // If single br tag found then remove it
          // if (isCurrent && !isPrev && !isNext) {
          //   writer.remove(child) // remove br tag
          //   // const childIndex = data.content.getChildIndex(child)
          //   // writer.insertChild(childIndex, child.getChildren(), data.content)
          // }
        }
      },
      { priority: 'high' }
    )
  }
}
