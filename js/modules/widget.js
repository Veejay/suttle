const uuid = require('uuid')
const PowerMap = require('./power_map.js')
const WidgetRenderer = require('./widget_renderer.js')
const IllegalMoveError = require('./illegal_move_error.js')
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
    this.basePath = basePath
    this.timestamps = PowerMap.create({
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }
  get createdAt () {
    return this.timestamps.get('createdAt')
  }
  set createdAt (timestamp) {
    throw new Error('Creation date cannot be changed')
  }
  get updatedAt () {
    return this.timestamps.get('updatedAt')
  }
  set updatedAt (timestamp) {
    this.timestamps.set('updatedAt', timestamp)
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
  moveTo (path) {
    const targetCollection = this.page.find(path)
    // A Something can only be moved to a SomethingCollection by definition
    if (Object.is(targetCollection.constructor.name, `${this.constructor.name}Collection`)) {
      targetCollection.add(this)
      // Would look better as this.page.delete(this.path)
      this.page.find(this.basePath).delete(this.id)
      // Now this would look better if we were interacting with the widget through a Proxy
      // This way we could have updatedAt be updated on all changes to the object's properties
      this.path = path
      this.updatedAt = Date.now()
    } else {
      throw new IllegalMoveError(`Widget ${this.id}, whose path is ${this.path} cannot move to ${path}`)
    }
  }
}

module.exports = Widget
