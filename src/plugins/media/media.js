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

      allowAttributes: ['id', 'src', 'title', 'type']
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
          id: viewElement.getAttribute('data-id'),
          src: viewElement.getAttribute('data-src'),
          title: viewElement.getAttribute('data-title'),
          type: viewElement.getAttribute('data-type')
        })
      }
    })

    // <productPreview> converters (model → data view)
    conversion.for('dataDowncast').elementToElement({
      model: 'media',
      view: (modelElement, { writer: viewWriter }) => {
        // <section class="media" data-id="..."></section>
        return viewWriter.createEmptyElement('section', {
          class: 'media',
          'data-id': modelElement.getAttribute('id'),
          'data-src': modelElement.getAttribute('src'),
          'data-title': modelElement.getAttribute('title'),
          'data-type': modelElement.getAttribute('type')
        })
      }
    })

    // <productPreview> converters (model → editing view)
    conversion.for('editingDowncast').elementToElement({
      model: 'media',
      view: (modelElement, { writer: viewWriter }) => {
        const id = modelElement.getAttribute('id')
        const src = modelElement.getAttribute('src')
        const title = modelElement.getAttribute('title')
        const type = modelElement.getAttribute('type')

        // The outermost <section class="product" data-id="..."></section> element.
        const section = viewWriter.createContainerElement('section', {
          class: 'media',
          'data-id': id,
          'data-src': src,
          'data-title': title,
          'data-type': type
        })

        // The inner <div class="product__react-wrapper"></div> element.
        // This element will host a React <ProductPreview /> component.
        const reactWrapper = viewWriter.createRawElement('div', {
          class: 'media__react-wrapper'
        }, function (domElement) {
          renderMedia({ id, src, title, type }, domElement)
        })

        viewWriter.insert(viewWriter.createPositionAt(section, 0), reactWrapper)

        return toWidget(section, viewWriter, { label: 'media widget' })
      }
    })
  }
}
