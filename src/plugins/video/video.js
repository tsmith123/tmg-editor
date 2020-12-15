import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import icon from '../../icons/video.svg'
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'

export default class Video extends Plugin {
  init () {
    const editor = this.editor

    editor.ui.componentFactory.add('video', () => {
      const view = new ButtonView()

      view.set({
        label: 'Insert Video',
        icon,
        tooltip: true
      })

      view.on('execute', () => {
        const handler = editor.config.get('media').handler
        handler.apply('video')
      })

      return view
    })
  }
}
