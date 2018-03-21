//打包时，将项目中所用到的dll的js,copy置项目的/js文件下
require('shelljs/global')

const fs = require('fs')
const glob = require('glob')
const path = require('path')
const utils = require('./utils')
const project = utils.argv.project

module.exports = (config, _site) => {
  const buildPath = config.dlls.dllPlugin.defaults.buildPath;
  const distPath = path.resolve(`dist/${_site}/${project}/client/js`);

  glob.sync(path.resolve(`${buildPath}/pa*.js`)).forEach(item => {
    if (!/(paReactDll)/.test(item)) {
      cp('-R', item, distPath)
    }
  })
}
