// https://github.com/shelljs/shelljs
'use strict'

require('./tools/check-versions')()
require('shelljs/global')

const ora = require('ora')  //在执行脚本的过程中，用于在终端中显示一个类似loading的标记
const chalk = require('chalk')  //用于在终端中显示彩色文字
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge') //深拷贝对象
const rimraf = require('rimraf') //用于删除文件和文件夹
const config = require('../config')
const copyModules = require('./tools/copy-modules')
const copyDlls = require('./tools/copy-dlls')
const webpackConfig = require('./webpack/webpack.build.conf')

const spinner = ora('building for production...')
spinner.start()


//判断是否存在配置json文件
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
//创建编译器函数
const creactCompiler = async () => {
  rimraf.sync('dist');
  const clientWebpackConfig = merge(webpackConfig[0], {
    resolve: {
      alias: {
        //设置路径别名
      }
    },
  });
  const serverWebpackConfig = merge(webpackConfig[1],{

  });
  const compiler = webpack([clientWebpackConfig,serverWebpackConfig]);
  compiler.apply(new ProgressPlugin());

  return await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')
      resolve();
    })
  })
}

//打包编译函数
async function Run() {
  await creactCompiler();
  copyDlls(config);
  copyModules(config);
  cp('-R', config.paths.bin, path.resolve(`dist/${config.build.name}/`))
  spinner.stop()
  console.log(chalk.cyan(`  Build complete. Project: ${config.build.name}\n`))
  console.log(chalk.yellow(
    '  Tip: built files under [client] are\n' +
    '       meant to be served over an HTTP server.\n' +
    '       Opening index.html over file:// won\'t work.\n'
  ))
}


Run();
