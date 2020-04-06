'use strict'
const {build, updateConfig} = require('./lib/nei')
const {myExec} = require('./lib/utils')
let userConfig = {}

// nei server
async function start(keys) {
  await build(keys)
  updateConfig(userConfig)
  await myExec('nei server -all -o ./nei-mock')
}

function Mock(config = {}) {
  userConfig = Object.assign({online: true, keys: []}, config)
  if (!userConfig.keys.length) {
    console.log('nei-mock error: project key is required')
    return
  }
  start(userConfig.keys).catch(function (error) {
    console.log('promise error', error)
  })
}

module.exports = Mock