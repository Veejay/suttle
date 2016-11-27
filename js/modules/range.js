function* rangeIterator (config) {
  for (let i = config.lower; i < config.upper; i += config.step) {
    yield i
  }
}
class Range {
  constructor ({lower, upper, step = 1}) {
    this.range = []
    for (let i of rangeIterator({ lower, upper, step })) {
      this.range.push(i)
    }
  }
  forEach (callback) {
    return this.range.forEach(callback)
  }
  map (mapper) {
    return this.range.map(mapper)
  }
  reduce (reducer, seed) {
    return this.range.reduce(reducer, seed)
  }
  filter (predicate) {
    return this.range.filter(predicate)
  }
}

module.exports = Range
