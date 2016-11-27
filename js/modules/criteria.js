const PowerMap = require('./power_map.js')

class Criteria {
  constructor (object) {
    this.criteria = PowerMap.create(object)
  }

  every (predicate) {
    return this.criteria.every((key, value) => {
      return predicate(key, value)
    })
  }
}

module.exports = Criteria
