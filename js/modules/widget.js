const uuid = require('uuid')
const PowerMap = require('./power_map.js')
const WidgetRenderer = require('./widget_renderer.js')

const CONSTANTS = {
  type: ['text', 'image', 'carousel', 'video'],
  spans: [1, 2, 3, 4, 6]
}

const randomAttribute = (property) => {
  const choices = CONSTANTS[property]
  return choices[Math.floor(Math.random() * choices.length)]
}

class Widget {
  constructor (widget, {page, basePath}) {
    Object.assign(this, widget)
    this.id = uuid.v4()
    this.page = page
    
    this.path = [basePath, this.id].join('/')
    
    this.timestamps = PowerMap.create({
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }
  get createdAt () {
    return this.timestamps.get('createdAt')
  }
  get updatedAt () {
    return this.timestamps.get('updatedAt')
  }
  update (attributes) {
    // TODO: We should add validation here (use a Proxy)
    Object.assign(this, attributes)
  }
  static random () {
    return new Widget(Object.keys(CONSTANTS).reduce((widget, key) => {
      widget[key] = randomAttribute(key)
      return widget
    }, Object.create(null)))
  }
  matches (criteria) {
    return criteria.every((key, value) => {
      // NOTE: Object.is doesn't handle empty arrays, we need a special case for that
      return Object.is(this[key], value)
    })
  }
  render () {
    const renderer = new WidgetRenderer(this)
    return renderer.render()
  }
  // moveTo (path) {
  //   const targetCollection = this.page.find(path)
  //   targetCollection.add(this)
  //   this.parent.delete(this.id)
  // }
}

module.exports = Widget
