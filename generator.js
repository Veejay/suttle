module.exports.collect = (object, callback) => {
  const iterator = function*(object) {
    Object.keys(object).forEach(key => {
      yield [key, object[key]]
    })
  }
  const result = []
  for (let [key, value] of iterator(object)) {
    result.push(callback(key, value))
  }
  return result
}