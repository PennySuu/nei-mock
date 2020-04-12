'use strict'
const {build, generateRouterMap} = require('./lib/nei')

async function start(app, config = {}) {
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
  start(app, config)
    .catch(function (error) {
      console.log('promise error', error)
    })
}

module.exports = Mock