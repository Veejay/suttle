const Page = require('./js/modules/page.js')
const tidy = require('htmltidy').tidy
const fs = require('fs')

const lorem = `
  On sait depuis longtemps que travailler avec du texte lisible et contenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même. L'avantage du Lorem Ipsum sur un texte générique comme 'Du texte. Du texte. Du texte.' est qu'il possède une distribution de lettres plus ou moins normale, et en tout cas comparable avec celle du français standard. De nombreuses suites logicielles de mise en page ou éditeurs de sites Web ont fait du Lorem Ipsum leur faux texte par défaut, et une recherche pour 'Lorem Ipsum' vous conduira vers de nombreux sites qui n'en sont encore qu'à leur phase de construction. Plusieurs versions sont apparues avec le temps, parfois par accident, souvent intentionnellement (histoire d'y rajouter de petits clins d'oeil, voire des phrases embarassantes).
`

const data = {
  page: {
    sections: [
      {
        properties: {
          'background-color': '#eee',
          'box-shadow': '8px 8px 24px #999'
        },
        rows: [
          {
            columns: [
              {
                spans: 6,
                widgets: [
                  {
                    type: 'text',
                    html: lorem
                  },
                  {
                    type: 'video',
                    source: 'https://www.youtube.com/embed/nU4OIAYwo5g'
                  }
                ]
              },
              {
                spans: 6,
                widgets: [
                  {
                    type: 'title',
                    size: 'xl',
                    text: 'Bonjour'
                  },
                  {
                    type: 'image',
                    source: 'https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_960_720.jpg'
                  }
                ]
              }
            ]
          },
          {
            columns: [
              {
                spans: 3,
                widgets: [
                  {
                    type: 'text',
                    html: lorem
                  }
                ]
              },
              {
                spans: 3,
                widgets: [
                  {
                    type: 'text',
                    html: lorem
                  }
                ]
              },
              {
                spans: 3,
                widgets: [
                  {
                    type: 'text',
                    html: lorem
                  }
                ]
              },
              {
                spans: 3,
                widgets: [
                  {
                    type: 'text',
                    html: lorem
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

const page = new Page(data.page)
const html = page.render()
const tidyOptions = {
  doctype: 'html5',
  indent: true,
  hideComments: true
}
tidy(html, tidyOptions, (err, html) => {
  fs.writeFile('./fixture.html', html, (error) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Wrote result to file')
    }
  })
})
