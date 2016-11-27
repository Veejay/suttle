const scan = (template) => {
  return template.match(/\{\{[^\}]+\}\}/g)
}

const copy = (e, {as}) => {
  let base = Object.create(null)
  base[as] = e
  return Object.assign(Object.create(null), base)
}

class Template {
  constructor (template) {
    this.template = template
    this.placeholders = scan(this.template)
    this.data = Object.create(null)
  }
  bind (data) {
    Object.assign(this.data, data)
  }
  render () {
    const placeholders = scan(this.template)
    // Make shallow copy of template using destructuring assignment
    let {shell} = copy(this.template, { as: 'shell' })
    for (let placeholder of placeholders) {
      const key = /\{\{([^\}]+)\}\}/.exec(placeholder)[1]
      if (key in this.data) {
        shell = shell.replace(placeholder, this.data[key])
      } else {
        throw new Error(`Undefined property ${placeholder} in ${this.data}`)
      }
    }
    this.content = shell
    return this.content
  }
}

module.exports = Template

