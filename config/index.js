const path = require('path')
const proxyTable = require('./proxy.conf')
const pm2Config = require('./pm2.conf')
const utils = require('../scripts/tools/utils')
const srcPath = path.resolve('src')
const distPath = path.resolve(`dist/${pm2Config.name}`)


module.exports = {
  build: {
    index: path.resolve(distPath, 'client/index.html'),
    name: pm2Config.name,
    includeModules: true,
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    port: 3001,
    noInfo: true,
    autoOpenBrowser: true,
    registerApi: true,
    hotApiRegex: /[\/\\](route|util|middleware|controller)[\/\\]/,
    proxyTable: proxyTable,
    cssSourceMap: false
  },
  dlls: require('./dll.conf'),
  paths: {
    publicPath: '/',
    output: distPath,
    bin: path.resolve(srcPath, 'bin'),
    client: path.resolve(srcPath, 'client'),
    server: path.resolve(srcPath, 'server'),
    modules: path.resolve('node_modules')
  },
  dists: {
    publicPath: './',
    client: path.resolve(distPath, 'client'),
    server: path.resolve(distPath, 'server'),
    modules: path.resolve(distPath, 'server/node_modules')
  },
  env: {
    development: require('./env/dev.env'),
    testing: require('./env/test.env'),
    production: require('./env/prod.env')
  },
  pm2: {
    apps: [pm2Config]
  }
}
