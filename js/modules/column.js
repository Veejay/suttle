const WidgetCollection = require('./widget_collection.js')
const uuid = require('uuid')
class Column {
  constructor (column, {page, basePath}) {
    this.page = page
    this.id = uuid.v4()
    this.path = [basePath, this.id].join('/')
    this.widgets = new WidgetCollection(column.widgets, {page, basePath: this.path})
    this.spans = column.spans
  }
  get styles () {
    return `col-md-${this.spans}`
  }
  find(id) {
    return this.widgets.find((widgetId, widget) => {
      return Object.is(widget.id, id)
    })
  }
  render () {
    return `
      <div class="${this.styles}">
        ${this.widgets.render()}
      </div>
    `
  }
}

module.exports = Column
