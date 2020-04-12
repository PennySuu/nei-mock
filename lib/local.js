const router = require('./router')
const {getDataFromLocal} = require('./nei')

function localMockMiddleware(request, response, next) {
  const path = request.path
  const method = request.method
  const routerItem = router[path]
  if (routerItem && routerItem.method.toLowerCase() === method.toLowerCase()) {
    getDataFromLocal(routerItem, (json) => {
      if (json) {
        response.status(200).json(json)
      } else {
        response.status(404).json({
          code: 404,
          msg: '接口数据为定义'
        })
      }
    })
  } else {
    next()
  }
}

module.exports = localMockMiddleware