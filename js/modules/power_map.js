class PowerMap extends Map {
  static create (object) {
    return Object.keys(object).reduce((memo, key) => {
      memo.set(key, object[key])
      return memo
    }, new PowerMap())
  }
  reduce (reducer, seed) {
    console.log(reducer.toString(), seed)
    for (let entry of this) {
      seed = reducer(seed, ...entry)
    }
    return seed
  }
  forEeach (callback) {
    for (let [k, v] of this) {
      callback(k, v)
    }
  }
  find (finder) {
    for (let [k, v] of this) {
      if (finder(k, v)) {
        return v
      }
    }
  }
  findAll (finder) {
    let result = []
    for (let [k, v] of this) {
      if (finder(k, v)) {
        result.push(v)
      }
    }
    return result
  }
  every (predicate) {
    for (let entry of this) {
      if (!predicate(...entry)) {
        return false
      }
    }
    return true
  }
  map (mapper) {
    let result = []
    for (let entry of this) {
      result.push(mapper(...entry))
    }
    return result
  }
}

module.exports = PowerMap
