import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import icon from '../../icons/image.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class Image extends Plugin {
  init () {
    const editor = this.editor

    editor.ui.componentFactory.add('image', () => {
      const view = new ButtonView()

      view.set({
        label: 'Insert Image',
        icon,
        tooltip: true
      })

      view.on('execute', () => {
        const handler = editor.config.get('media').handler
        handler && handler('image')
      })

      return view
    })
  }
}
