import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import icon from '../../icons/html.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class Html extends Plugin {
  init () {
    const editor = this.editor

    editor.ui.componentFactory.add('html', () => {
      const view = new ButtonView()

      view.set({
        label: 'Embed particle/other',
        icon,
        tooltip: true
      })

      view.on('execute', () => {
        const handler = editor.config.get('media').handler
        handler && handler('html')
      })

      return view
    })
  }
}
