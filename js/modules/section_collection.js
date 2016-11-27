const Collection = require('./collection.js')
const Section = require('./section.js')

class SectionCollection extends Collection {
  constructor(sections, { page, basePath }) {
    const path = [basePath, 'sections'].join('/')
    super(sections.map(section => {
      return new Section(section, { page, basePath: path })
    }), { page })
    this.path = path
  }
}

module.exports = SectionCollection
