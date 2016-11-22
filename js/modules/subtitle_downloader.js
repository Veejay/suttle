const request = require('request')
const pathname = require('path')
const ContentProxy = require('./content_proxy.js')
const unzip = require('unzip')

class SubtitleDownloader {
  constructor (path) {
    this.fileName = pathname.basename(path)
  }
  saveAs (path) {
    const proxy = new ContentProxy('subscene')
    console.log(proxy)
    proxy.getSubtitle(this.fileName).then(url => {
      console.log(`https://subscene.com${url}`)
      request(`https://subscene.com${url}`).pipe(unzip.Extract({ path: path }))
      console.log("Downloaded.\nExtracted.\nRenamed.")
    }).catch(error => {
      console.log(error)
    })
  }
}

module.exports = SubtitleDownloader
