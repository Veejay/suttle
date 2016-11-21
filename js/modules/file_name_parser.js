const REGEXES = new Map([
  ['episode:number', new RegExp(/s[\d]+e[\d]+/, 'i')],
  ['episode:date', new RegExp(/[\d]{4}[\.|-][\d]{2}[\.|-][\d]{2}/i)]
])

class FileNameParser {
  constructor (name) {
    this.name = name
  }
  hasEpisodeNumber () {
    return REGEXES.get('episode:number').test(this.name)
  }
  hasEpisodeDate () {
    return REGEXES.get('episode:date').test(this.name)
  }
  get episodeNumber () {
    return REGEXES.get('episode:number').exec(this.name)[0].toLowerCase()
  }
  get episodeDate () {
    return REGEXES.get('episode:date').exec(this.name)[0]
  }
}
module.exports = FileNameParser
