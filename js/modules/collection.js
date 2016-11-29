const PowerMap = require('./power_map.js')

class Collection {
  constructor (items = [], {page}) {
    this._map = PowerMap.create(items.reduce((memo, item) => {
      memo[item.id] = Object.assign(item, {page})
      return memo
    }, Object.create(null)))
    this.page = page
  }
  elementAt ({index}) {
    let i = 0
    for (let value of this.values()) {
      if (Object.is(i++, index)) {
        return value
      }
    }
  }
  add (item) {
    this._map.set(item.id, item)
    return item
  }
  upsert (item) {
    this._map.set(item.id, item)
  }
  first () {
    const [head, _] = this._map.values()
    return head
  }
  get (id) {
    return this._map.get(id)
  }
  values () {
    return this._map.values()
  }
  delete (id) {
    this._map.delete(id)
  }
  find (criteria) {
    return this._map.find((id, item) => item.matches(criteria))
  }
  findAll (criteria) {
    return this._map.findAll((id, item) => item.matches(criteria))
  }
  reduce (reducer, seed) {
    return this._map.reduce(reducer, seed)
  }
  map (mapper) {
    return this._map.map(mapper)
  }
  filter (filterer) {
    return this._map.filter(filterer)
  }
  render () {
    return this.map((id, item) => {
      return item.render()
    }).join('')
  }
}

module.exports = Collection
