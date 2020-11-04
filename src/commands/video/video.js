import Command from '@ckeditor/ckeditor5-core/src/command'

export default class VideoCommand extends Command {
  execute (id) {
    this.editor.model.change(writer => {
      // Insert <productPreview id="...">*</productPreview> at the current selection position
      // in a way which will result in creating a valid model structure.
      this.editor.model.insertContent(writer.createElement('video', { id }))
    })
  }

  refresh () {
    const model = this.editor.model
    const selection = model.document.selection
    const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'video')

    this.isEnabled = allowedIn !== null
  }
}
