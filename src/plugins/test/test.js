import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import icon from '@ckeditor/ckeditor5-core/theme/icons/image.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class Test extends Plugin {
  init (param) {
    const editor = this.editor

    editor.ui.componentFactory.add('test', () => {
      const view = new ButtonView()

      view.set({
        label: 'Insert Video',
        icon,
        tooltip: true
      })

      view.on('execute', () => {
        const handler = editor.config.get('media').showVideoBrowser
        handler.apply()
      })

      return view
    })
  }
}
