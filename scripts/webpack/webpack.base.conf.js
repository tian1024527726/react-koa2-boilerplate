const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack') //提升构建速度
const ExtractTextPlugin = require('extract-text-webpack-plugin') //抽离css
const config = require('../../config')
const utils = require('../tools/utils')
const dllConfig = config.dlls.dllPlugin.defaults;
const externals = _externals()
//server代码中不需要打包的模块
function _externals() {
  let dependencies = require(`../../src/server/package.json`).dependencies
  let externals = {}
  for (let dep in dependencies) {
    externals[dep] = 'commonjs ' + dep
  }
  return externals
}
//编译client代码的基础配置
const clientWebpackConfig = {
  name: 'client',
  //文件打包输出设置
  output: {
    path: config.dists.client,
    publicPath: config.paths.publicPath,
    filename: '[name].js'
  },
  //调试工具,开发环境开启eval-source-map,生产构建时不开启
  devtool: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing') ? false : '#eval-source-map',
  plugins: [
    //webpack编译过程中设置全局变量process.env
    new webpack.DefinePlugin({
      'process.env': config.env[process.env.NODE_ENV]
    }),
    //优化require
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|zh/),
    //用于提升构建速度
    new HappyPack({
      id: 'babel',
      threads: 1,
      loaders: [{
        loader: 'babel-loader'
      }]
    }),
  ],
  resolve: {
    //设置模块导入规则，import/require时会直接在这些目录找文件
    modules: [path.resolve(`src/client/components`), path.resolve('h5_common/components'), 'node_modules'],
    //import导入时省略后缀
    extensions: ['.js', '.jsx', '.react.js', '.css', '.json'],
    //import导入时别名
    alias: {
      '@client': path.resolve(`src/client`),
      '@h5_commonr': path.resolve('h5_common'),
      '@styles': path.resolve(`src/client/styles/pages`),
      '@dllAliasMap': path.resolve(`${dllConfig.buildPath}/dllAliasMap`),
      '@importDll': path.resolve('h5_common/utils/importDll')
    }
  },
  module: {
    //设置所以编译文件的loader
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: config.paths.client,
        exclude: /node_modules/,
        enforce: 'pre',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: ['happypack/loader?id=babel'],
        // exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'img/[name].[ext]',
              limit: 2048,
              fallback: 'file-loader'
            }
          }
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: 'url-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  performance: {
    //性能设置,文件打包过大时，不报错和警告，只做提示
    hints: false
  }
}
//编译server代码的基础配置
const serverWebpackConfig = {
  name: 'server',
  devtool: false,
  //编译入口
  entry: [`./src/server/index.js`],
  output: {
    path: config.dists.server,
    publicPath: config.paths.publicPath,
    filename: '[name].js'
  },
  target: 'node',
  //node环境变量设置
  node: {
    __filename: false,
    __dirname: false
  },
  //不需要打包的模块设置
  externals: externals,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        include: config.paths.server,
        exclude: /node_modules/,
        enforce: 'pre',
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: config.paths.server,
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json']
  }
}

module.exports = {
  client: clientWebpackConfig,
  server: serverWebpackConfig
}
