'use strict';

const common = require('./common.js');
const path = require('path');
const debug = common.debug;
const extractJs = common.extractJs;

const generateReplacementScriptTag = (jsFilename, compilation, minifier) => {
  return {
    tagName: 'script',
    closeTag: true,
    innerHTML: extractJs(jsFilename, compilation, minifier),
    attributes: {
        type: 'text/javascript'
    }
  };
};

const convertToPath = (jsFilename, pluginArgs, compilation) => {
  // public path: copied from https://github.com/jantimon/html-webpack-plugin/blob/master/index.js#L394
  const prefix = typeof compilation.options.output.publicPath !== 'undefined'
    ? compilation.mainTemplate.getPublicPath({hash: compilation.hash})
    : path.relative(path.resolve(compilation.options.output.path, path.dirname(pluginArgs.plugin.childCompilationOutputName)), compilation.options.output.path)
      .split(path.sep).join('/');
  if (prefix) {
    jsFilename = path.join(prefix, jsFilename);
  }

  // hash:
  if (pluginArgs.plugin.options.hash) {
    const suffix = (jsFilename.indexOf('?') === -1) ? '?' : '&';
    jsFilename = `${jsFilename}${suffix}${compilation.hash}`;
  }

  debug(`looking for script path '${jsFilename}'`);
  return jsFilename;
};

const replaceScriptTag = (scriptPath, tags, replacementTag) => {
  for (let index = 0; index < tags.length; index++) {
    if (isJsScriptTag(tags[index], scriptPath)) {
      tags[index] = replacementTag;
      debug(`replaced <script> with <script>`);
      return;
    }
  }
  tags.push(replacementTag);
  debug('added new <script>');
};
//判断是否是script标签
const isJsScriptTag = (tagDefinition, scriptPath) => {
  if (!tagDefinition) return false;
  if (tagDefinition.tagName !== 'script') return false;
  if (!tagDefinition.attributes) return false;
  if (!tagDefinition.attributes.src) return false;
  if (tagDefinition.attributes.src !== scriptPath) return false;
  debug(`script element found for script path '${scriptPath}'`);
  return true;
};

const replaceScriptTagWithScriptTag = (jsFilename, pluginArgs, compilation, minifier) => {
  const replacementTag = generateReplacementScriptTag(jsFilename, compilation, minifier);
  const scriptPath = convertToPath(jsFilename, pluginArgs, compilation);
  replaceScriptTag(scriptPath, pluginArgs.body, replacementTag);
};

module.exports = replaceScriptTagWithScriptTag;
