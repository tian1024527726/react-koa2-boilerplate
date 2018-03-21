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
const utils = require('./tools/utils')
const project = utils.argv.project
const site = utils.argv.site

const spinner = ora('building for production...')
spinner.start()


//判断是否存在配置json文件
const pfsPath = path.resolve(`buildConfig/target/${project}/index.js`);
const isExistPfs = fs.existsSync(pfsPath);
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
//创建编译器函数
const creactCompiler = async (_site) => {
  const clientPath = path.resolve(`dist/${_site}/${project}/client`);
  const serverPath = path.resolve(`dist/${_site}/${project}/server`);
  rimraf.sync(`dist/${_site}/${project}`);
  const clientWebpackConfig = merge(webpackConfig[0], {
    output: { path: clientPath },
    resolve: {
      alias: {
        '@site': path.resolve(`buildConfig/site/${_site}`),
      }
    },
  });
  // const serverWebpackConfig = merge(webpackConfig[1],{output:{path:serverPath}});
  // const compiler = webpack([clientWebpackConfig,serverWebpackConfig]);
  const compiler = webpack([clientWebpackConfig]);
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
  if (isExistPfs && site == true) {
    const pfsFile = fs.readFileSync(pfsPath, 'utf-8');
    const pfsContent = JSON.parse(pfsFile).site;
    for (const site of pfsContent) {
      await creactCompiler(site);
      copyDlls(config,site);
      // copyModules(config,site)
      // cp('-R', config.paths.bin, path.resolve(`dist/${site}/${project}`))
    }
  } else if (!isExistPfs && site == true) {
    console.error(`Something wrong for site!!!!
                `);
    process.exit(0);
  } else {
    await creactCompiler(site);
    copyDlls(config, site);
    // copyModules(config,site)
    // cp('-R', config.paths.bin, path.resolve(`dist/${site}/${project}`))
  }
  spinner.stop()
  console.log(chalk.cyan(`  Build complete. Project: ${config.build.name}\n`))
  console.log(chalk.yellow(
    '  Tip: built files under [client] are\n' +
    '       meant to be served over an HTTP server.\n' +
    '       Opening index.html over file:// won\'t work.\n'
  ))
}


Run();
