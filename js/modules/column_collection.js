const Collection = require('./collection.js')
const Column = require('./column.js')
class ColumnCollection extends Collection {
  constructor (columns, {page, basePath}) {
    const path = [basePath, 'columns'].join('/')
    super(columns.map(column => {
      return new Column(column, { page, basePath: path })
    }), { page })
    this.path = path
  }

}

module.exports = ColumnCollection
