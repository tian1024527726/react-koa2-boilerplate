'use strict';

const UglifyJs = require('uglify-js');
const common = require('./common.js');
const debug = common.debug;
const error = common.error;
const denormaliseOptions = require('./config.js');
const findJsFile = require('./findFile.js');
const replaceScriptTagWithScriptTag = require('./replaceTag.js');
const insertScriptTagInHtml = require('./insertScript.js');
const deleteFileFromCompilation = require('./removeFile.js');

const wirePluginEvent = (event, compilation, fn) => {
  compilation.plugin(event, (pluginArgs, callback) => {
    try {
      fn(pluginArgs);
      callback(null, pluginArgs);
    } catch (err) {
      callback(err);
    }
  });
};

class ScriptExtHtmlWebpackPlugin {
  constructor (options) {
    this.options = denormaliseOptions(options);
    debug(`constructor: ${JSON.stringify(this.options)}}`);
  }

  apply (compiler) {
    const options = this.options;
    if (!options.enabled) return;
    const minifier = (options.minify)
      ? new UglifyJs(options.minify)
      : false;
    let jsFilename;

    compiler.plugin('compilation', (compilation) => {
      wirePluginEvent(
        'html-webpack-plugin-before-html-processing',
        compilation,
        (pluginArgs) => {
          jsFilename = findJsFile(options, pluginArgs.plugin.options, compilation);
        }
      );

      if (options.position === 'plugin') {
        wirePluginEvent(
          'html-webpack-plugin-alter-asset-tags',
          compilation,
          (pluginArgs) => {
            if (jsFilename) {
                replaceScriptTagWithScriptTag(jsFilename, pluginArgs, compilation, minifier);
            }
          }
        );
      }

      if (options.position !== 'plugin') {
        wirePluginEvent(
          'html-webpack-plugin-after-html-processing',
          compilation,
          (pluginArgs) => {
            if (jsFilename) {
              insertScriptTagInHtml(jsFilename, options.position, pluginArgs, compilation, minifier);
            }
          }
        );
      }
      //删除原文件
      wirePluginEvent(
        "html-webpack-plugin-after-emit",
        compilation,
        (pluginArgs) => {
            if (jsFilename) {
                deleteFileFromCompilation(jsFilename, compilation);
            }
        }
      )
    });
  }

  /**
   * Guard against pre v3 configurations
   */
  static inline (loaders) {
    error(`--------------------------------出错了！----------------------------`);
  }
}

module.exports = ScriptExtHtmlWebpackPlugin;
