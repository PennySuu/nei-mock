'use strict'

async function start(app, config = {}) {
  const {build, generateRouterMap} = require('./lib/nei')
  await build(config.keys)
  generateRouterMap()
  if (config.online) {
    app.use(require('./lib/online.js'))
  } else {
    app.use(require('./lib/local.js'))
  }
}

function Mock(app, config = {}) {
  if (!config.keys.length) {
    console.log('mock-nei error: project key is required')
    return
  }
  global.config = config
  if (app) {
    start(app, config)
      .catch(function (error) {
        console.log('promise error', error)
      })
  } else {
    if (config.online) {
      return require('./lib/online.js')
    } else {
      return require('./lib/local.js')
    }
  }

}

module.exports = Mock