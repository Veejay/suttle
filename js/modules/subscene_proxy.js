const Q = require('q')
const cheerio = require('cheerio')
const queryString = require('querystring')
const Pinky = require('./pinky.js')

const SubtitleScorer = require('./subtitle_scorer.js')

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

class SubsceneProxy {
  getSubtitle (name) {
    return Q.promise((resolve, reject) => {
      Pinky.request(`https://subscene.com/subtitles/release?q=${queryString.escape(name)}`).then(html => {
        let $ = cheerio.load(html)
        const fileNames = $('table tr').map((index, element) => {
          const firstColumn = cheerio(element).find('td.a1')
          const firstColumnContent = firstColumn.text().trim()
          let [language, name] = firstColumnContent.split(/\s{2,}/)
          let link = cheerio(element).find('td.a1').find('a').attr('href')
          return { language, name, link }
        })
        const scorer = new SubtitleScorer({ fileName: name })
        const names = fileNames.toArray().filter(object => {
          return FILTERS.englishSubtitle(object)
        }).filter(object => {
          return FILTERS.isDefined(object)
        })
        const bestSubtitle = scorer.findBestMatch(names).match
        Pinky.request(`https://subscene.com${bestSubtitle.link}`).then(html => {
          let selector = cheerio.load(html)
          resolve(selector('a#downloadButton').attr('href'))
        }).catch(error => {
          reject(error)
        })
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = SubsceneProxy
