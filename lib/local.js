const fs = require('fs')
const path = require('path')
const {build} = require('./nei')
const root_nei = global.mock_nei_config.root || 'mock-nei'
build(mock_nei_config.keys)

function localMockMiddleware(request, response, next) {
  const mockFile = request.method.toLowerCase()+'/'+request.path + '/data.json'
 if(fs.existsSync(path.resolve(`${root_nei}/mock`, mockFile))){
   const {getDataFromLocal} = require('./nei')
   getDataFromLocal(path.resolve(`${root_nei}/mock`, mockFile), (json) => {
     if (json) {
       response.status(200).json(json)
     } else {
       response.status(404).json({
         code: 404,
         msg: '接口数据为定义'
       })
     }
   })
 }else{
   next()
 }
}

module.exports = localMockMiddleware