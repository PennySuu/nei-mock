const {build, generateRouterMap} = require('./nei')
let router = null
build(mock_nei_config.keys).then(() => {
  generateRouterMap()
  router = require('./router')
})

function onlineMockMiddleware(request, response, next) {
  if (!router) {
    next()
    return
  }
  const {getDataFromServer} = require('./nei')
  const path = request.path
  const method = request.method
  const routerItem = router[path]
  if (routerItem && routerItem.method.toLowerCase() === method.toLowerCase()) {
    getDataFromServer(routerItem, (json) => {
      if (json) {
        response.status(200).json(json)
      } else {
        response.json(404, {
          code: 404,
          msg: '接口数据未定义'
        })
      }
    })
  } else {
    next()
  }
}

module.exports = onlineMockMiddleware