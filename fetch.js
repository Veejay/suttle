const request = require('request')
const cheerio = require('cheerio')
const Q = require('q')

// We'll be consuming the urls 8 at a time
const CONCURRENCY = 8

const urls = [
  'http://www.theforesters.us/',
  'http://www.afrobeat.com.au/',
  'http://www.washivore.org/',
  'http://www.peterlovatt.com/',
  'http://www.robertallansalon.com/',
  'http://0fth3n1ght.net',
  'http://1000uglypeople.com',
  'http://10cred.com',
  'http://1st-stops.com',
  'http://1stcallelectricllc.com',
  'http://2013mwrm.sites.acs.org',
  'http://4platanos.com',
  'http://5pcarpetcleaning.com',
  'http://5starrtransportation.com',
  'http://7franch.com',
  'http://883sportster.com',
  'http://a-sproductions.com',
  'http://a2zenvironmentalservicesinc.com',
  'http://abarkandameow.com',
  'http://abbeyroadpresentsjoey.com',
  'http://abetterpennridge.net',
  'http://about-hoodia.com',
  'http://absolutelyfabulouscostumehire.com',
  'http://academianlp.com',
  'http://academyofmakeuparts.com',
  'http://accuratebusiness.com',
  'http://acemsmissions.net'
]

const fetch = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        resolve({ url: url, body: '' })
      } else {
        resolve({ url, body })
      }
    })
  })
}

const slices = []
const numberOfSlices = Math.ceil(urls.length / CONCURRENCY)

// Ugly but it's the easiest, most readable and probably fastest way
for (let i = 0; i < numberOfSlices; i++) {
  slices.push(urls.splice(0, CONCURRENCY))
}

const matchesSelector = (html, selector) => {
  return cheerio.load(html)(selector).length > 0
}

const initialValue = {
  webs: [],
  others: []
}

const processSlice = (slice, info) => {
  return Q.promise((resolve, reject) => {
    Q.all(slice.map(fetch)).then(results => {
      const reduction = results.reduce((memo, result) => {
        console.log(`Processing ${result.url}`)
        if (matchesSelector(result.body, '.webs-bin')) {
          memo.webs.push(result.url)
        } else {
          memo.others.push(result.url)
        }
        return memo
      }, info)
      resolve(reduction)
    }).catch(reject)
  })
}

const classify = (slices) => {
  return Q.promise((resolve, reject) => {
    const result = slices.reduce((memo, slice) => {
      memo = memo.then(classifier => {
        return processSlice(slice, classifier)
      })
      return memo
    }, Q(initialValue))
    resolve(result)
  })
}

const format = ({webs, others}) => {
  return `
Webs Website Builder:
#####################
${webs.map(url => '- ' + url).join('\n')}

Others:
#######
${others.map(url => '- ' + url).join('\n')}
  `
}

classify(slices).then(({webs, others}) => {
  console.log(format({ webs, others }))
}).catch(console.error)
