import Command from '@ckeditor/ckeditor5-core/src/command'

export default class InsertFrameCommand extends Command {
  execute (data) {
    this.editor.model.change(writer => {
      this.editor.model.insertContent(writer.createElement('frame', data))
    })
  }

  refresh () {
    const model = this.editor.model
    const selection = model.document.selection
    const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'frame')

    this.isEnabled = allowedIn !== null
  }
}
