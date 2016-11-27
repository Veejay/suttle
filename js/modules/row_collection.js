const Collection = require('./collection.js')
const Row = require('./row.js')

class RowCollection extends Collection {
  constructor (rows, {page, basePath}) {
    const path = [basePath, 'rows'].join('/')
    super(rows.map(row => {
      return new Row(row, { page, basePath: path })
    }), { page })
    this.path = path
  }
}

module.exports = RowCollection
