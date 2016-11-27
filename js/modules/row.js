const ColumnCollection = require('./column_collection.js')
const uuid = require('uuid')
class Row {
  constructor(row, {page, basePath}) {
    this.page = page
    this.id = uuid.v4()
    this.path = [basePath, this.id].join('/')
    this.columns = new ColumnCollection(row.columns, { page, basePath: this.path })
  }
  render() {
    return `
      <div class="row">
        ${this.columns.render()}
      </div>
    `
  }
  find(id) {
    return this.columns.find(e => {
      return Object.is(e.id, id)
    })
  }

}

module.exports = Row
