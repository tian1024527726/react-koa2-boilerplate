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
//压缩大的数据时会报错
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const config = require('../../config')
const utils = require('../tools/utils')
const dllConfig = config.dlls.dllPlugin.defaults;
const dllPath = path.resolve(dllConfig.buildPath);
const plugins = [
  new webpack.LoaderOptionsPlugin({
    minimize: true
  }),
  new ParallelUglifyPlugin({
    uglifyJS: {
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      },
      output: {
        comments: false
      }
    }
  }),
  // new webpack.optimize.ModuleConcatenationPlugin(),
  //dll预构建依赖包，commonchunk对公用模块打包
  new webpack.optimize.CommonsChunkPlugin({
    name: "index",
    minChunks: 2,
    children: true,
    deepChildren: true,
  }),
  new ExtractTextPlugin({
    filename: 'stylesheet/[name].css?[chunkhash:8]',
    disable: false,
    allChunks: true,
  }),
  new ManifestPlugin({
    fileName: 'asset-manifest.json',
  }),
  // Generate a service worker script that will precache, and keep up to date,
  // the HTML & assets that are part of the Webpack build.
  new SWPrecacheWebpackPlugin({
    // By default, a cache-busting query parameter is appended to requests
    // used to populate the caches, to ensure the responses are fresh.
    // If a URL is already hashed by Webpack, then there is no concern
    // about it being stale, and the cache-busting can be skipped.
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'service-worker.js',
    logger(message) {
      if (message.indexOf('Total precache size is') === 0) {
        // This message occurs for every build and is a bit too noisy.
        return;
      }
      if (message.indexOf('Skipping static resource') === 0) {
        // This message obscures real errors so we ignore it.
        // https://github.com/facebookincubator/create-react-app/issues/2612
        return;
      }
      console.log(message);
    },
    minify: true,
    // For unknown URLs, fallback to the index page
    navigateFallback: '/index.html',
    // Ignores URLs starting from /__ (useful for Firebase):
    // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
    navigateFallbackWhitelist: [/^(?!\/__).*/],
    // Don't precache sourcemaps (they're large) and build asset manifest:
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
  }),
  new HtmlWebpackPlugin({
    template: 'src/client/index.html',
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
    // hash: true
  }),
];
const manifests = glob.sync(path.resolve(`${dllPath}/*Dll.json`));
manifests.forEach(item => {
  plugins.push(new webpack.DllReferencePlugin({
    context: process.cwd(),
    manifest: item,
  }))
})
glob.sync(`${dllConfig.buildPath}/reactDll*.dll.js`).forEach((dllPath) => {
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
    index: './src/client/index.js'
  },
  output: {
    publicPath: config.dists.publicPath,
    filename: 'js/[name].js?[chunkhash:8]',
    chunkFilename: 'js/[name].chunk.js?[chunkhash:8]'
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
  entry: './src/server/index.js',
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

