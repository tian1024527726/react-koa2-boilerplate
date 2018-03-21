'use strict'

//热模块替换,需要设置的入口文件夹
require('eventsource-polyfill')
const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

hotClient.subscribe(event => {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
