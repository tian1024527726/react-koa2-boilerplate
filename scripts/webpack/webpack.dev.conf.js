const path = require('path')
const fs = require('fs')
const glob = require('glob') //match文件路径模块
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin') //html模块插件
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin') //html模板中嵌入资源的插件，配合html-webpack-plugin插件一起使用
const ExtractTextPlugin = require('extract-text-webpack-plugin') //抽离css
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin') //友好的错误提示，会显示具体的错误位置
const config = require('../../config')
const utils = require('../tools/utils')
const project = utils.argv.project
const site = utils.argv.site
const dllConfig = config.dlls.dllPlugin.defaults;

const plugin = [
  //热模块替换插件
  new webpack.HotModuleReplacementPlugin(),
  //webpack的id本来是1,2,3...数字，将其替换成模块名路径，方便开发时调试
  new webpack.NamedModulesPlugin(),
  // new ExtractTextPlugin({
  //     filename: 'stylesheet/[name].[chunkhash:8].css',
  //     disable: false,
  //     allChunks: true,
  // }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    inject: true,
    template: `${project}/client/index.html`,
    favicon: 'favicon.ico'
  }),
  new FriendlyErrorsPlugin()
]
if (dllConfig) {
  glob.sync(`${dllConfig.devPath}/paReactDll*.dll.js`).forEach((dllPath) => {
    plugin.push(
      new AddAssetHtmlPlugin({
        filepath: dllPath,
        includeSourcemap: false,
        typeOfAsset: 'js'
      })
    );
  });
}
function dependencyHandlers() {

  // 如果没有在config中没有dllConfig,就是用commonsChunkPlugin
  if (!dllConfig) {
    return [
      //公共模块提取插件
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        children: true,
        minChunks: 2,
        async: true,
      }),
    ];
  }

  const dllPath = path.resolve(dllConfig.devPath);

  /**
   *
   *
   */
  if (!dllConfig.dlls) {
    const plugins = [];
    const manifests = glob.sync(path.resolve(`${dllPath}/pa*Dll.json`))

    console.log(manifests)
    if (!manifests.length) {
      console.error('The DLL manifest is missing. Please run `yarn build:dll`');
      process.exit(0);
    }
    manifests.forEach(item => {
      plugins.push(new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: item,
      }))
    })
    //dll插件，配合DllPlugin使用
    return plugins;
  }
}

const clientWebpackConfig = merge(baseWebpackConfig.client, {
  name: 'client',
  entry: {
    index: ['./scripts/tools/dev-client', `./${project}/client/index.js`]
  },
  output: {
    chunkFilename: 'js/[name].chunk.js'
  },
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  resolve: {
    alias: {
      '@site': path.resolve(`buildConfig/site/${site}`),
    }
  },
  plugins: dependencyHandlers().concat(plugin)
})

module.exports = [clientWebpackConfig, baseWebpackConfig.server]
