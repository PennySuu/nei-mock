'use strict'

function Mock(app, config = {}) {
  if (!config.keys.length) {
    console.log('mock-nei error: project key is required')
    return
  }
  global.mock_nei_config = config
  if (app) {
    app.use(require(`./lib/${config.online ? 'online' : 'local'}.js`))
  }else{
    return require(`./lib/${config.online ? 'online' : 'local'}.js`)
  }
}

module.exports = Mock