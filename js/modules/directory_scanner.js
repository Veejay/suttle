const Q = require('q')
const pathname = require('path')
const fs = require('fs')

const VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mkv']

const isVideo = (path) => {
  return VIDEO_EXTENSIONS.includes(pathname.extname(path))
}
const stat = (path) => {
  return Q.promise((resolve, reject) => {
    fs.stat(path, (error, stats) => {
      if (error) {
        reject(error)
      } else {
        if (stats.isDirectory()) {
          resolve({ path: path, type: 'directory' })
        } else {
          if (stats.isFile() && isVideo(path)) {
            resolve({ path: path, type: 'file' })
          } else {
            resolve({ path: path, type: 'other' })
          }
        }
      }
    })
  })
}

class DirectoryScanner {
  constructor (path) {
    this.path = path
  }
  scan () {
    return Q.promise((resolve, reject) => {
      fs.readdir(this.path, (error, entries) => {
        if (error) {
          reject(error)
        } else {
          // stats is an array of Promises
          let stats = entries.map(entry => {
            return stat(pathname.join(this.path, entry))
          })
          Q.all(stats).then(results => {
            const directories = results.filter(e => {
              return Object.is(e.type, 'directory')
            }).map(e => e.path)
            const files = results.filter(e => {
              return Object.is(e.type, 'file')
            }).map(e => e.path)
            const map = new Map([
              ['directories', new Set(directories)],
              ['files', new Set(files)]
            ])
            resolve(map)
          }).catch(error => {
            reject(error)
          })
        }
      })
    })
  }
}

module.exports = DirectoryScanner
