//打包时，将项目中所用到的dll的js,copy置项目的/js文件下
require('shelljs/global')

const fs = require('fs')
const glob = require('glob')
const path = require('path')

module.exports = (config) => {
  const buildPath = config.dlls.dllPlugin.defaults.buildPath;
  const distPath = path.resolve(`${config.dists.client}/js`);

  glob.sync(path.resolve(`${buildPath}/*Dll*.js`)).forEach(item => {
    if (!/(paReactDll)/.test(item)) {
      cp('-R', item, distPath)
    }
  })
}
