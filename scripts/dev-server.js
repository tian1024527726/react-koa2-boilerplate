require('./tools/check-versions')()
require('babel-polyfill')
require('babel-core/register')()

// 导入模块
const Koa = require('koa')
const c2k = require('koa2-connect') //使express的插件，能再koa中使用
const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const opn = require('opn')
const config = require('../config')
const KWM = require('koa-webpack-middleware') //开启本地服务，并用webpack实时编译，实现热加载的核心模块
const proxyMiddleware = require('http-proxy-middleware')  //代理模块
const chafMiddleware = require('connect-history-api-fallback')  //api重定向模块，在使用history路由使用时，一直定向到index.html
const webpackConfig = require('./webpack/webpack.dev.conf')
const utils = require('./tools/utils')
const project = utils.argv.project
const staticroot = path.resolve('')

// 设置端口
const port = process.env.PORT || config.dev.port
const proxyTable = config.dev.proxyTable

const app = new Koa()
const compiler = webpack(webpackConfig)

const devMiddleware = KWM.devMiddleware(compiler, {
  noInfo: config.dev.noInfo,
  watchOptions: {
    aggregateTimeout: 300,
    poll: false
  },
  publicPath: config.paths.public,
  stats: {
    colors: true,
    chunks: false
  }
})

// 热编译中间件中只传入client的webpack编译器对象，server不需要
const hotMiddleware = KWM.hotMiddleware(compiler.compilers.find(c => c.name === 'client'))
// force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', compilation => {
//   compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// 代理api设置
// Object.keys(proxyTable).forEach(context => {
//   let options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = { target: options }
//   }
//   app.use(c2k(proxyMiddleware(options.filter || context, options)))
// })

//设置开发环境
app.env = 'development'
app.use(c2k(chafMiddleware()))
app.use(devMiddleware)
app.use(hotMiddleware)

app.use(koaMount('/', koaStatic(staticroot)))
// 注册server的Api
// if (config.dev.registerApi) {
//   console.log(chalk.yellow('> Registering server Api... \n'))
//   const registerApi = require(`../${project}/server/register`).default

//   const watcher = require('chokidar').watch(config.paths.server)

//   registerApi(app)

//   watcher.on('ready', () => {
//     watcher.on('all', (err, file) => {
//       console.log(file, config.dev.hotApiRegex.test(file))

//       if (!config.dev.hotApiRegex.test(file)) {
//         console.log(chalk.red('> Rebooting server... \n [Not implemented yet]'))
//         // TBD
//       } else {
//         console.log(chalk.yellow('> Reloading hot modules of server... \n'))
//         Object.keys(require.cache).forEach(id => {
//           if (config.dev.hotApiRegex.test(id)) delete require.cache[id]
//         })
//         console.log(chalk.green('> Hot modules of server are reloaded... \n'))
//       }
//     })
//   })
// }

// 开启服务
const uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(() => {
  console.log(chalk.green(`> Listening at ${uri} \n`))
})

module.exports = app.listen(port, err => {
  if (err) {
    console.log(chalk.red(err))
    return
  }

  // 自动打开浏览器
  if (config.dev.autoOpenBrowser) {
    opn(uri)
  }
})
