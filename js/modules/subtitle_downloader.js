const request = require('request')
const pathname = require('path')
const ContentProxy = require('./content_proxy.js')
const unzip = require('unzip')

class SubtitleDownloader {
  constructor(path) {
    this.fileName = pathname.basename(path)
  }
  saveAs(path) {
    return new Promise((resolve, reject) => {
      const proxy = new ContentProxy('subscene')
      proxy.getSubtitle(this.fileName).then(url => {
        request(`https://subscene.com${url}`).pipe(unzip.Extract({ path: path }))
        resolve(path)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

module.exports = SubtitleDownloader
