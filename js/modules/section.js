const RowCollection = require('./row_collection.js')
const uuid = require('uuid')

class Section {
  constructor (section, {page, basePath}) {
    this.page = page
    this.id = uuid.v4()
    this.path = [basePath, this.id].join('/')
    this.rows = new RowCollection(section.rows, {page, basePath: this.path})
    this.properties = section.properties
  }
  get style () {
    return `background-color: ${this.properties['background-color']}; box-shadow: ${this.properties['box-shadow']}`
  }
  addRow (row, index) {
    this.rows = [...this.rows.slice(0, index), row, ...this.rows.slice(index, this.rows.length)]
  }
  render () {
    return `
      <section style="${this.style}" class="container" id="${this.id}">
        ${this.rows.render()}
      </section>
    `
  }
  find(id) {
    return this.rows.find(e => {
      return Object.is(e.id, id)
    })
  }
}

module.exports = Section
