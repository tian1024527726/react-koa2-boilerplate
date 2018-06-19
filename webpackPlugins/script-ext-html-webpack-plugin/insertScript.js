'use strict';

const common = require('./common.js');
const extractJs = common.extractJs;
const debug = common.debug;
const error = common.error;

const errorMsg = '-------------------- 出错了！--------------------';

const createScriptTag = (jsFilename, compilation, minifier) => {
  const js = extractJs(jsFilename, compilation, minifier);
  const scriptTag = `<script type="text/javascript">${js}</script>`;
  debug('added new <style>');
  return scriptTag;
};

const insertScriptTagInHtml = (jsFilename, position, pluginArgs, compilation, minifier) => {
  const scriptTag = createScriptTag(jsFilename, compilation, minifier);
  let toReplace;
  let replaceWith;
  switch (position) {
    case 'head-top':
      toReplace = '<head>';
      replaceWith = toReplace + scriptTag;
      break;
    case 'head-bottom':
      toReplace = '</head>';
      replaceWith = scriptTag + toReplace;
      break;
    case 'body-top':
      toReplace = '<body>';
      replaceWith = toReplace + scriptTag;
      break;
    case 'body-bottom':
      toReplace = '</body>';
      replaceWith = scriptTag + toReplace;
      break;
    default:
      error(errorMsg);
  }
  pluginArgs.html = pluginArgs.html.replace(toReplace, replaceWith);
};

module.exports = insertScriptTagInHtml;
