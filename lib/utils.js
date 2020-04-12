const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const path = require('path')
const process = require('process')

var SEPARATOR = process.platform === 'win32' ? ';' : ':'
var env = new Proxy(process.env, {
  get: function (target, propKey) {
    var key
    for (key in target) {
      if (key.toLowerCase() === propKey.toLowerCase()) {
        return target[key]
      }
    }
  },
  set: function (target, propKey, value) {
    var key
    for (key in target) {
      if (key.toLowerCase() === propKey.toLowerCase()) {
        target[key] = value
        return true
      }
    }
  }
})
env.PATH = path.resolve('./node_modules/mock-nei/node_modules/.bin/') + SEPARATOR + (env.PATH || '')
exports.myExec = function (cmd) {
  return exec(cmd, {
    cwd: process.cwd(),
    env: env
  })
}

exports.queryStringify = function (object) {
  if (!object) return ''
  let queryStr = []
  for (let key in object) {
    queryStr.push(key + '=' + encodeURIComponent(object[key]))
  }
  return queryStr.join('&')
}
exports.getKeys = function () {
  let keys = []
  if (fs.existsSync('./mock-nei')) {
    fs.readdirSync('./mock-nei').forEach(dir => {
      // dir: nei.projectId.key
      if (dir.startsWith('nei.')) {
        keys.push(dir.split('.')[2])
      }
    })
  }
  return keys
}

const root_keys = []
exports.updateKeys = function (keys) {
  fs.writeFile(root_keys, keys, (err) => {
    if (err) {
      console.log('updateKeys error', err)
    }
  })
}
/**
 * 同步递归创建路径
 *
 * @param  {string} dir   处理的路径
 * @param  {function} cb  回调函数
 */
exports.$$mkdir = function (dir, cb) {
  var pathinfo = path.parse(dir)
  if (!fs.existsSync(pathinfo.dir)) {
    $$mkdir(pathinfo.dir, function () {
      fs.mkdirSync(pathinfo.dir)
    })
  }
  cb && cb()
}