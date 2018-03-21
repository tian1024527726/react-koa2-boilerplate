const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const glob = require('glob')
const merge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin') //压缩css
const config = require('../../config')
const utils = require('../tools/utils')
const project = utils.argv.project
const dllConfig = config.dlls.dllPlugin.defaults;
const dllPath = path.resolve(dllConfig.buildPath);
const plugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  // new webpack.optimize.UglifyJsPlugin({
  //     'screw-ie8': true,
  //     sourceMap: true,
  //     compress: {
  //         warnings: false,
  //         drop_debugger: true,
  //         drop_console: true
  //     },
  //     output: {
  //         comments: false
  //     }
  // }),
  // new webpack.optimize.ModuleConcatenationPlugin(),
  //dll预构建依赖包，commonchunk对公用模块打包
  new webpack.optimize.CommonsChunkPlugin({
    name: "index",
    minChunks: 2,
    children: true,
    deepChildren: true,
  }),
  new ExtractTextPlugin({
    filename: 'stylesheet/[name].[chunkhash:8].css',
    disable: false,
    allChunks: true,
  }),
  new OptimizeCSSPlugin({
    cssProcessorOptions: {
      safe: true
    }
  }),
  new HtmlWebpackPlugin({
    template: `${project}/client/index.html`,
    //防止各site项目一样时，不生成html文件
    cache: false,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
    inject: true,
    hash: true
  }),
];
const manifests = glob.sync(path.resolve(`${dllPath}/pa*Dll.json`));
manifests.forEach(item => {
  plugins.push(new webpack.DllReferencePlugin({
    context: process.cwd(),
    manifest: item,
  }))
})
glob.sync(`${dllConfig.buildPath}/paReactDll*.dll.js`).forEach((dllPath) => {
  plugins.push(
    new AddAssetHtmlPlugin({
      filepath: dllPath,
      includeSourcemap: false,
      publicPath: './js',
      context: process.cwd(),
      outputPath: 'js',
      typeOfAsset: 'js'
    })
  );
});
glob.sync(`${dllConfig.buildPath}` + '/*.dll.css').forEach((dllPath) => {
  plugins.push(
    new AddAssetHtmlPlugin({
      filepath: dllPath,
      includeSourcemap: false,
      publicPath: './stylesheet',
      context: process.cwd(),
      outputPath: 'stylesheet',
      typeOfAsset: 'css'
    })
  );
});

const clientWebpackConfig = merge(baseWebpackConfig.client, {
  entry: {
    index: `./${project}/client/index.js`
  },
  output: {
    publicPath: config.dists.publicPath,
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      publicPath: '../'
    })
  },
  plugins: plugins
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  clientWebpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

const serverWebpackConfig = merge(baseWebpackConfig.server, {
  entry: `./${project}/server/index.js`,
  output: {
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  }
})

if (process.argv.slice(2)[0] == '--analyze') {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  clientWebpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = [clientWebpackConfig, serverWebpackConfig]

