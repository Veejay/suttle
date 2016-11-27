const Collection = require('./collection.js')
const Widget = require('./widget.js')
class WidgetCollection extends Collection {
  constructor (widgets, { page, basePath }) {
    const path = [basePath, 'widgets'].join('/')
    super(widgets.map(widget => {
      return new Widget(widget, { page, basePath: path })
    }), { page })
    this.path = path
  }
}

module.exports = WidgetCollection
