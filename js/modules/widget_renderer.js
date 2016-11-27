const PowerMap = require('./power_map.js')
const Template = require('./template.js')

const TEMPLATES = PowerMap.create({
  'TEXT': new Template(`
    <div class="text-container">{{html}}</div>
  `),
  'VIDEO': new Template(`
    <div class="video-container"><iframe width="560" height="315" src="{{source}}" frameborder="0" allowfullscreen></iframe></div>
  `),
  'TITLE': new Template(`
    <div class="title-container"><h2>{{text}}</h2></div>
  `),
  'IMAGE': new Template(`
    <div class="image-container"><img src="{{source}}" /></div>
  `)
})

class WidgetRenderer {
  constructor (widget) {
    this.widget = widget
  }
  render () {
    const template = TEMPLATES.get(this.widget.type.toUpperCase())
    template.bind(this.widget)
    return template.render()
  }
}

module.exports = WidgetRenderer
