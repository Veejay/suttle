const fs = require('fs')
const cheerio = require('cheerio')
const SubtitleScorer = require('./js/modules/subtitle_scorer.js')

const FILTERS = {
  englishSubtitle: (object) => {
    return Object.is(object.language.trim(), 'English')
  },
  isDefined: (object) => {
    return Object.keys(object).every(key => {
      return object[key]
    })
  }
}

fs.readFile('subs.html', 'utf-8', (error, contents) => {
  if (error) {
    console.log(error)
  } else {
    let $ = cheerio.load(contents)
    const fileNames = $('table tr').map((index, element) => {
      const firstColumn = cheerio(element).find('td.a1')
      const firstColumnContent = firstColumn.text().trim()
      let [language, name] = firstColumnContent.split(/\s{2,}/)
      let link = cheerio(element).find('td.a1').find('a').attr('href')
      return { language, name, link }
    })
    const scorer = new SubtitleScorer({fileName: 'Vice.Principals.S01E04.720p.HDTV.x264-KILLERS[eztv]'})
    const names = fileNames.toArray().filter(object => {
      return FILTERS.englishSubtitle(object)
    }).filter(object => {
      return FILTERS.isDefined(object)
    })
    scorer.findBestMatch(names)
  }
})
