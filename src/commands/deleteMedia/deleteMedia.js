import Command from '@ckeditor/ckeditor5-core/src/command'

export default class DeleteMediaCommand extends Command {
  execute (id) {
    this.editor.model.change(writer => {
      const root = this.editor.model.document.getRoot()
      const elements = root.getChildren()

      for (let element of elements) {
        console.log(element)
        const json = element.toJSON()
        console.log(json)
        // if(child.is('image')) {
        //   writer.remove(child)
        // }
      }
    })
  }

  refresh () {
    // const model = this.editor.model
    // const selection = model.document.selection
    // const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'media')

    // this.isEnabled = allowedIn !== null
  }
}
