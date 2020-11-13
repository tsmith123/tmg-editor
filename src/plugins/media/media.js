import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils'
import Widget from '@ckeditor/ckeditor5-widget/src/widget'
import MediaCommand from '../../commands/media'

export default class MediaPlugin extends Plugin {
  static get requires () {
    return [Widget]
  }

  init () {
    this._defineSchema()
    this._defineConverters()

    this.editor.commands.add('insertMedia', new MediaCommand(this.editor))
  }

  _defineSchema () {
    const schema = this.editor.model.schema

    schema.register('media', {
      // Behaves like a self-contained object (e.g. an image).
      isObject: true,

      // Allow in places where other blocks are allowed (e.g. directly in the root).
      allowWhere: '$block',

      // Each product preview has an ID. A unique ID tells the application which
      // product it represents and makes it possible to render it inside a widget.
      allowAttributes: ['id']
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
        // Read the "data-id" attribute from the view and set it as the "id" in the model.
        return modelWriter.createElement('media', {
          // id: parseInt(viewElement.getAttribute('data-id'))
        })
      }
    })

    // <productPreview> converters (model → data view)
    conversion.for('dataDowncast').elementToElement({
      model: 'media',
      view: (modelElement, { writer: viewWriter }) => {
        // In the data view, the model <productPreview> corresponds to:
        //
        // <section class="product" data-id="..."></section>
        return viewWriter.createEmptyElement('section', {
          class: 'media'
          // 'data-id': modelElement.getAttribute('id')
        })
      }
    })

    // <productPreview> converters (model → editing view)
    conversion.for('editingDowncast').elementToElement({
      model: 'media',
      view: (modelElement, { writer: viewWriter }) => {
        // In the editing view, the model <productPreview> corresponds to:
        //
        // <section class="product" data-id="...">
        //     <div class="product__react-wrapper">
        //         <ProductPreview /> (React component)
        //     </div>
        // </section>

        // const id = modelElement.getAttribute('id')

        // The outermost <section class="product" data-id="..."></section> element.
        const section = viewWriter.createContainerElement('section', {
          class: 'media'
          // 'data-id': id
        })

        // The inner <div class="product__react-wrapper"></div> element.
        // This element will host a React <ProductPreview /> component.
        const reactWrapper = viewWriter.createRawElement('div', {
          class: 'media__react-wrapper'
        }, function (domElement) {
          // This the place where React renders the actual product preview hosted
          // by a UIElement in the view. You are using a function (renderer) passed as
          // editor.config.products#productRenderer.
          renderMedia(domElement)
        })

        viewWriter.insert(viewWriter.createPositionAt(section, 0), reactWrapper)

        return toWidget(section, viewWriter, { label: 'media widget' })
      }
    })
  }
}
