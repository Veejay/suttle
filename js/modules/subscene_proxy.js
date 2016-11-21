const Q = require('q')
const cheerio = require('cheerio')
const queryString = require('querystring')
const Pinky = require('./pinky.js')
const FileNameParser = require('./file_name_parser.js')


const queryUrl = (name) => {
  const BASE = 'https://subscene.com/subtitles/release?q='
  return `${BASE}${queryString.escape(name)}`
}

class SubsceneProxy {

  getSubtitle (name) {
    return Q.promise((resolve, reject) => {
      Pinky.request(queryUrl(name)).then(html => {
        let $ = cheerio.load(html)
        let matches = []
        const segments = name.split('.')

        $('table tr').each((index, element) => {
          const firstColumnContent = cheerio(element).find('td.a1').text().trim()
          let [language, name] = firstColumnContent.split(/\s{2,}/)
          if ([language, name].every(e => typeof e !== 'undefined') && Object.is(language.trim(), 'English')) {

            let parser = new FileNameParser(name)
            let score = 0
            // If the video file is a TV show episode, there
            // might be an episode number in the name
            if (parser.hasEpisodeNumber()) {
              if (segments.includes(parser.episodeNumber)) {
                for (let segment of segments) {
                  if (name.indexOf(segment) !== -1) {
                    score += 1
                  }
                }
                const data = { score: score, name: name, link: cheerio(element).find('td.a1 a').attr('href') }
                matches.push(data)
              }
            } else {
              for (let segment of segments) {
                if (name.indexOf(segment) !== -1) {
                  score += 1
                }
              }
              matches.push({ score: score, name: name, link: cheerio(element).find('td.a1 a').attr('href') })
            }
          }
        })
        console.log(matches)
        Pinky.request('https://subscene.com' + matches[0].link).then(body => {
          const selector = cheerio.load(body)
          resolve(selector('a[href^="/subtitle/download"]').attr('href'))
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
