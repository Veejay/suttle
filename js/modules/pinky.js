const Q = require('q')
const request = require('request')
class Pinky {
  static request (uri) {
    return Q.promise((resolve, reject) => {
      request(uri, (error, response, body) => {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  }
}

module.exports = Pinky
