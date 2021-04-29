import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

export default class ItalicsAsEm extends Plugin {
  static get pluginName () {
    return 'ItalicsAsEm'
  }

  init () {
    this.editor.conversion.for('downcast').attributeToElement({
      model: 'italic',
      view: 'em',
      converterPriority: 'high'
    })
  }
}
