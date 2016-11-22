const FileNameParser = require('./file_name_parser.js')

class SubtitleScorer {
  constructor ({fileName, separator = '.'}) {
    this.parser = new FileNameParser(fileName)
    Object.assign(this, { fileName, separator })
    this.segments = this.fileName.split(this.separator).map(e => e.toLowerCase())
  }
  score (subtitleFileName) {
    const segments = subtitleFileName.split(this.separator).map(e => e.toLowerCase())
    return segments.reduce((score, chunk) => {
      let weight = 1
      if (this.parser.hasEpisodeNumber() && Object.is(this.parser.episodeNumber, chunk)) {
        weight *= 2
      }
      score += this.segments.includes(chunk) ? weight : 0
      return score
    }, 0)
  }

  findBestMatch (subtitles) {
    const bestMatch = subtitles.reduce((memo, object) => {
      const score = this.score(object.name)
      if (score > memo.score) {
        memo = {
          match: object,
          score: score
        }
      }
      return memo
    }, {name: '', score: -1})
    return bestMatch
  }
}

module.exports = SubtitleScorer
