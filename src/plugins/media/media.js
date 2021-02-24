import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import InsertMediaCommand from '../../commands/insertMedia'

export default class MediaPlugin extends Plugin {
  static get requires () {
    return [Widget]
  }

  init () {
    this._defineSchema()
    this._defineConverters()

    this.editor.commands.add('insertMedia', new InsertMediaCommand(this.editor))
  }

  _defineSchema () {
    const schema = this.editor.model.schema

    schema.register('media', {
      // Behaves like a self-contained object (e.g. an image).
      isObject: true,

      // Allow in places where other blocks are allowed (e.g. directly in the root).
      allowWhere: '$block',

      allowAttributes: ['type', 'src', 'props']
    })
  }

  _defineConverters () {
    const editor = this.editor
    const conversion = editor.conversion
    const renderMedia = editor.config.get('media').renderer

    // <productPreview> converters ((data) view → model)
    conversion.for('upcast').elementToElement({
      view: {
        name: 'section',
        classes: 'media'
      },
      model: (viewElement, { writer: modelWriter }) => {
        // Read the "data-xxx" attributes from the view and set them as "xxx" in the model.
        return modelWriter.createElement('media', {
          type: viewElement.getAttribute('data-type'),
          src: viewElement.getAttribute('data-src'),
          props: viewElement.getAttribute('data-props')
        })
      }
    })

    // <productPreview> converters (model → data view)
    conversion.for('dataDowncast').elementToElement({
      model: 'media',
      view: (modelElement, { writer: viewWriter }) => {
        // <section class="media" data-src="<src>"></section>
        return viewWriter.createEmptyElement('section', {
          class: 'media',
          'data-type': modelElement.getAttribute('type'),
          'data-src': modelElement.getAttribute('src'),
          'data-props': modelElement.getAttribute('props')
        })
      }
    })

    conversion.for('editingDowncast').elementToElement({
      model: 'media',
      view: (modelElement, { writer: viewWriter }) => {
        const type = modelElement.getAttribute('type')
        const src = modelElement.getAttribute('src')
        const props = modelElement.getAttribute('props')

        // The outermost <section class="media" data-src="<src>"></section> element
        const section = viewWriter.createContainerElement('section', {
          class: 'media',
          'data-type': type,
          'data-src': src,
          'data-props': props
        })

        // The inner <div class="media__react-wrapper"></div> element
        const reactWrapper = viewWriter.createRawElement('div', {
          class: 'media__react-wrapper'
        }, function (domElement) {
          renderMedia({ type, src, props }, domElement)
        })

        viewWriter.insert(viewWriter.createPositionAt(section, 0), reactWrapper)

        return toWidget(section, viewWriter, { label: 'media widget' })
      }
    })
  }
}
