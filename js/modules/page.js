const SectionCollection = require('./section_collection.js')
const uuid = require('uuid')
class Page {
  constructor (page) {
    this.sections = new SectionCollection(page.sections, {page: this, basePath: ''})
    this.id = uuid.v4()
  }

  find (path) {
    const segments = path.split('/').filter(e => !Object.is(e, ''))
    return segments.reduce((memo, segment) => {
      if (['sections', 'rows', 'columns', 'widgets'].includes(segment)) {
        memo = memo[segment]
      } else {
        memo = memo.get(segment)
      }
      return memo
    }, this)
  }
  render() {
    return `
      <html>
        <head>
          <meta charset="UTF-8">
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
          <style type="text/css">
            section {
              padding-top: 16px;
              padding-bottom: 16px
            }
            img {
              width: 100%;
              height: auto
            }
          </style>
          <title>Page</title>
        </head>
        <body>
          <div id="${this.id}">
            ${this.sections.render()}
          </div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js">
          </script>
          <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js">
          </script>
        </body>
      </html>
    `
  }
}

module.exports = Page
