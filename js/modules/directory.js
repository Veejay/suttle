const Q = require('q')
const DirectoryScanner = require('./directory_scanner.js')

class Directory {
  constructor (path) {
    this.path = path
  }
  findVideos () {
    return Q.promise((resolve, reject) => {
      const scanner = new DirectoryScanner(this.path)
      scanner.scan().then(map => {
        const directories = [...map.get('directories')].map(directory => {
          const dir = new Directory(directory)
          return dir.findVideos()
        })
        Q.all(directories).then(results => {
          const aggregate = results.reduce((acc, result) => {
            for (let file of [...result]) {
              acc.add(file)
            }
            return acc
          }, map.get('files'))
          resolve(aggregate)
        }).catch(error => console.log(error))
      }).catch(error => {
        console.log(error)
        resolve(new Set())
      })
    })
  }
}


module.exports = Directory
