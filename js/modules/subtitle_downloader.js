const fs = require('fs')
const request = require('request')
const pathname = require('path')

const Pinky = require('./pinky.js')

class SubtitleDownloader {
  constructor (path) {
    this.fileName = pathname.basename(path)
  }
  download () {
    return request(this.uri).pipe(fs.createWriteStream('subtitle.zip'))
  }
}

module.exports = SubtitleDownloader
