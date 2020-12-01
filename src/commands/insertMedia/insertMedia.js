import Command from '@ckeditor/ckeditor5-core/src/command'

export default class InsertMediaCommand extends Command {
  execute (data, insertAtTop) {
    this.editor.model.change(writer => {
      if (insertAtTop) {
        writer.setSelection(writer.createPositionAt(this.editor.model.document.getRoot(), 0))
      }

      this.editor.model.insertContent(writer.createElement('media', data))
    })
  }

  refresh () {
    const model = this.editor.model
    const selection = model.document.selection
    const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'media')

    this.isEnabled = allowedIn !== null
  }
}
