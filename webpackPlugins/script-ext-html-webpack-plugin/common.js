'use strict';

const debug = require('debug')('ScriptExt');

const PLUGIN = 'ScriptExtHtmlWebpackPlugin';

const error = msg => {
  const err = new Error(`${PLUGIN}: ${msg}`);
  err.name = PLUGIN + 'Error';
  debug(`${PLUGIN} error: ${msg}`);
  throw err;
};

const extractJs = (jsFilename, compilation, minifier) => {
  let js = compilation.assets[jsFilename].source();
  debug(`Js in compilation: ${js}`);
  if (minifier) {
    js = minifier.minify(js).styles;
    debug(`Minified Js: ${js}`);
  }
  return js;
};
//导出debug、error、extractJs函数
exports.debug = debug;
exports.error = error;
exports.extractJs = extractJs;
