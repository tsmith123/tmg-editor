import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import InsertFrameCommand from '../../commands/insertFrame'

export default class FramePlugin extends Plugin {
  static get requires () {
    return [Widget]
  }

  init () {
    this._defineSchema()
    this._defineConverters()

    this.editor.commands.add('insertFrame', new InsertFrameCommand(this.editor))
  }

  _defineSchema () {
    const schema = this.editor.model.schema

    schema.register('frame', {
      isObject: true,

      allowWhere: '$block',

      allowAttributes: ['html', 'type']
    })
  }

  _defineConverters () {
    const editor = this.editor
    const conversion = editor.conversion
    const renderFrame = editor.config.get('frame').renderer

    // <productPreview> converters ((data) view → model)
    conversion.for('upcast').elementToElement({
      view: {
        name: 'section',
        classes: 'frame'
      },
      model: (viewElement, { writer: modelWriter }) => {
        // Read the "data-xxx" attributes from the view and set them as "xxx" in the model.
        return modelWriter.createElement('frame', {
          html: viewElement.getAttribute('data-html'),
          type: viewElement.getAttribute('data-type')
        })
      }
    })

    // <productPreview> converters (model → data view)
    conversion.for('dataDowncast').elementToElement({
      model: 'frame',
      view: (modelElement, { writer: viewWriter }) => {
        // <section class="frame" data-id="..."></section>
        return viewWriter.createEmptyElement('section', {
          class: 'frame',
          'data-html': modelElement.getAttribute('html'),
          'data-type': modelElement.getAttribute('type')
        })
      }
    })

    // <productPreview> converters (model → editing view)
    conversion.for('editingDowncast').elementToElement({
      model: 'frame',
      view: (modelElement, { writer: viewWriter }) => {
        const html = modelElement.getAttribute('html')
        const type = modelElement.getAttribute('type')

        const section = viewWriter.createContainerElement('section', {
          class: 'frame',
          'data-html': html,
          'data-type': type
        })

        const reactWrapper = viewWriter.createRawElement('div', {
          class: 'frame__react-wrapper'
        }, function (domElement) {
          renderFrame({ html, type }, domElement)
        })

        viewWriter.insert(viewWriter.createPositionAt(section, 0), reactWrapper)

        return toWidget(section, viewWriter, { label: 'frame widget' })
      }
    })
  }
}
