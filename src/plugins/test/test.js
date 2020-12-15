import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import icon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class Test extends Plugin {
  constructor () {
    this.handler = () => console.log('Handler 1')
  }

  init (param) {
    console.log('Test plugin was initialized')
    console.log(param)
    console.log(this)
    const editor = this.editor

    editor.ui.componentFactory.add('test', () => {
      const view = new ButtonView()

      view.set({
        label: 'Insert Video',
        icon,
        tooltip: true
      })

      view.on('execute', () => {
        this.handler.apply()
      })

      return view
    })
  }

  static loadHandler (handler) {
    this.handler = handler
  }
}
