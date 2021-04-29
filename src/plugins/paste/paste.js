import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
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

    const writer = new UpcastWriter(viewDocument)
    editor.plugins.get('ClipboardPipeline').on('inputTransformation', (evt, data) => {
      const childrenIterator = data.content.getChildren()
      const children = Array.from(childrenIterator)
      const numChildren = children.length

      const separator = 'br'

      // If pasted content already contains p tags
      // then assume it's coming from Google doc or similar
      // and just remove all br tags that seem to be added during the copy/paste flow
      if (children.some(child => child.name === 'p')) {
        for (const child of children) {
          if (child.name === separator) {
            writer.remove(child)
          }
        }
      } else {
        // If no praragraphs then assume source is gmail client
        // and group children into paragraphs and remove multiple br tags
        // and switch single br tags for spaces
        const blocks = children.reduce((acc, val, i, arr) => {
          if (val.name === separator) {
            if (arr[i - 1]?.name === separator) {
              if (acc[acc.length - 1].length) acc.push([])
              return acc
            } else if (arr[i + 1]?.name === separator) return acc
            else {
              // Replace single br with space
              const space = writer.createText(' ')
              acc[acc.length - 1].push(space)
              return acc
            }
          }

          acc[acc.length - 1].push(val)

          return acc
        }, [[]])

        writer.removeChildren(0, numChildren, data.content)

        blocks.forEach((block, i) => {
          const element = writer.createElement('p')
          writer.insertChild(0, block, element)
          writer.insertChild(i, element, data.content)
        })
      }
    }, { priority: 'normal' })
  }
}
