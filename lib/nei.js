'use strict'
const fs = require('fs')
const path = require('path')
const {getKeys, myExec, queryStringify} = require('./utils')
const root_nei = global.config.root || 'mock-nei'

exports.build = async function (keys) {
  const originKeys = getKeys()
  for (let key of keys) {
    if (originKeys.includes(key)) {
      await myExec(`nei update -k ${key} -o ${root_nei} -s https://nei.hz.netease.com`)
    } else {
      await myExec(`nei build -k ${key} -o ${root_nei} -s https://nei.hz.netease.com`)
    }
  }
}

exports.generateRouterMap = function () {
  if (fs.existsSync(path.resolve(root_nei))) {
    const dirList = fs.readdirSync(path.resolve(root_nei))
    let routerMap = {}
    for (let dir of dirList) {
      // dir: nei.projectId.key
      if (dir.startsWith('nei.')) {
        const {routes, projectKey} = require(path.resolve(`${root_nei}/${dir}/server.config.js`))
        for (const router in routes) {
          // ajax接口
          if (routes[router].path) {
            let [method, url] = router.split(' ')
            url = url.split('?')[0] // 去除url上的参数例如：?oderId=xxx
            routerMap[url] = {method, projectKey, ...routes[router]}
          }
        }
      }
    }
    fs.writeFileSync(path.resolve(__dirname, './router.js'), 'module.exports=' + JSON.stringify(routerMap, null, 2))
  }
}

exports.getDataFromServer = function (params, callback) {
  let query = {
    path: params.path,
    type: 3,
    key: params.projectKey,
    id: params.id,
    method: params.method
  }
  let url = 'https://nei.hz.netease.com/api/mockdata?=' + queryStringify(query)
  require('https').get(url, (res) => {
    const {statusCode} = res
    const contentType = res.headers['content-type']

    let error
    if (statusCode !== 200) {
      error = new Error('请求失败\n' + `状态码: ${statusCode}`)
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('无效的 content-type.\n' + `期望的是 application/json 但接收到的是 ${contentType}`)
    }
    if (error) {
      console.error(error.message)
      // 消费响应数据来释放内存。
      res.resume()
      return
    }

    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => {
      rawData += chunk
    })
    res.on('end', () => {
      let parsedData = null
      try {
        parsedData = JSON.parse(rawData)
      } catch (e) {
        console.error(e.message)
      }
      if (parsedData && parsedData.code === 200) {
        callback(parsedData.result.json)
      } else {
        callback()
      }
    })
  }).on('error', (e) => {
    console.error(`出现错误: ${e.message}`)
  })
}


exports.getDataFromLocal = function (params, callback) {
  const mockFile = params.path + '.json'
  if (fs.existsSync(path.resolve(`${root_nei}/mock`, mockFile))) {
    const data = fs.readFileSync(path.resolve(`${root_nei}/mock`, mockFile), 'utf8')
    try {
      callback(JSON.parse(data))
    } catch (e) {
      callback()
      console.error(e)
    }
  } else {
    callback()
  }
}