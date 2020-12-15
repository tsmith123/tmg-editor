import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import icon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class Test extends Plugin {
  init (param) {
    console.log('Param', param)
    console.log('Test plugin was initialized')

    const editor = this.editor

    editor.ui.componentFactory.add('test', () => {
      const view = new ButtonView()

      view.set({
        label: 'Insert Video',
        icon,
        tooltip: true
      })

      // Callback executed once the image is clicked.
      view.on('execute', () => {
        console.log('HIT')
      })

      return view
    })
  }
}
