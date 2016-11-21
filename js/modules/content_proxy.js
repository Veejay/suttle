const SubsceneProxy = require('./subscene_proxy.js')

class ContentProxy {
  constructor (strategy) {
    switch (strategy) {
      case 'subscene':
        this.proxy = new SubsceneProxy()
        break
    }
  }
  getSubtitle (name) {
    this.proxy.getSubtitle(name)
  }
}

module.exports = ContentProxy
