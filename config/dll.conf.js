const path = require('path');
const utils = require('../scripts/tools/utils');
const pullAll = require('lodash/pullAll');//数组除值
const uniq = require('lodash/uniq');//数组去重
const glob = require('glob');//Match files
const project = utils.argv.project;
const componentsPath = glob.sync(path.resolve('h5_commonr'));


const reactDll = {
  version: '1.0.0',
  dllPlugin: {
    defaults: {
      exclude: [

      ],
      include: [
        "eventsource-polyfill",
        "babel-polyfill",
        'whatwg-fetch',
        'react',
        'react-dom',
        'react-redux',
        'redux',
        'react-router',
        'classnames',
        path.resolve('h5_commonr/noAnyDoor/jsrsasignc'),
      ],
      //针对开发本地调试用devPath，针对各种环境打包时用buildPath
      devPath: 'h5_commonr/@react_dll/dev_dll',
      buildPath: process.env.NODE_ENV === 'development' ? 'h5_commonr/@react_dll/dev_dll' : 'h5_commonr/@react_dll/prd_dll',
    },

    entry(pgk) {
      const dependencyNames = [];
      if (pgk) dependencyNames = Object.keys(pkg.dependencies);
      const exclude = reactDll.dllPlugin.defaults.exclude;
      const include = reactDll.dllPlugin.defaults.include;
      const includeDependencies = uniq([...include, ...dependencyNames]);
      return {
        paReactDll: pullAll(includeDependencies, exclude),
        paScrollDll: ['better-scroll'],
        paChartDll: ['highcharts']
      };
    },
  },
};

module.exports = reactDll;
