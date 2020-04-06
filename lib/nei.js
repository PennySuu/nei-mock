'use strict'
const fs = require('fs')
const path = require('path')
const {getKeys, updateKeys, myExec, $$mkdir} = require('./utils')

const root_nei = './mock-nei'

exports.build = async function (keys) {
  const originKeys = getKeys()
  let newKeys = []
  for (let key of keys) {
    if (originKeys.includes(key)) {
      await myExec(`nei update -k ${key} -o ./mock-nei`)
    } else {
      await myExec(`nei build -k ${key} -o ./mock-nei`)
      newKeys.push(key)
    }
  }
  updateKeys(JSON.stringify([...originKeys, ...newKeys]))
}

exports.updateConfig = function (userConfig) {
  if (fs.existsSync(path.resolve(root_nei))) {
    const dirList = fs.readdirSync(path.resolve(root_nei))
    for (let dir of dirList) {
      // dir: nei.projectId.key
      if (dir.startsWith('nei.')) {
        const config = require(path.resolve(`${root_nei}/${dir}/server.config.js`))
        fs.writeFileSync(path.resolve(`${root_nei}/${dir}/server.config.js`), 'module.exports=' + JSON.stringify(Object.assign(config, userConfig), null, 2))
      }
    }
  }
}

let dir = []

function readDir(parentPath) {
  var files = fs.readdirSync(parentPath)
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(parentPath, files[i])
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      readDir(filePath)
    } else {
      if (!dir.includes(parentPath)) {
        dir.push(parentPath)
      }
    }
  }
}

exports.relocateMockDir = function () {
  const root_mock = path.join(__dirname, './nei/mock')
  if (!fs.existsSync(path.resolve('./mock'))) {
    fs.renameSync(root_mock, './mock')
  } else {
    readDir(root_mock)
    for (let i = 0; i < dir.length; i++) {
      const parentPath = dir[i]
      const dest = path.join(__dirname, parentPath.substr(3))
      if (!fs.existsSync(dest)) {
        $$mkdir(dest, () => {
          fs.renameSync(path.resolve(parentPath), dest)
        })
      }
    }
  }
}