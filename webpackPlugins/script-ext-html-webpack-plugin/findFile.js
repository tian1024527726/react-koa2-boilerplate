'use strict';

const common = require('./common.js');

const debug = common.debug;
const error = common.error;

const JS_REGEX = /\.js$/;
const NO_FILES = {};

const validateJsFile = jsFilename => filename => filename === jsFilename;

const identifyJsFile = jsRegex => filename => (jsRegex || JS_REGEX).test(filename);

const allFiles = () => true;

const onlyChunkFiles = (chunkNames, htmlWebpackPluginChunks, compilation) => {
  // cannot use Array.prototype.includes < node v6
  let matchingChunks = compilation.chunks.filter(chunk => chunkNames.indexOf(chunk.name) > -1);
  if (htmlWebpackPluginChunks) {
    matchingChunks = matchingChunks.filter(chunk => htmlWebpackPluginChunks.indexOf(chunk.name) > -1);
  }
  return matchingChunks.length > 0
    ? filename => matchingChunks.some(chunk => chunk.files.indexOf(filename) > -1)
    : NO_FILES;
};

const findGeneratedJsFile = (fileMatcher, fileFilter, compilation) => {
  const filenames = Object.keys(compilation.assets).filter(fileFilter);
  for (let filename of filenames) {
    if (fileMatcher(filename)) {
      debug(`Js file in compilation: '${filename}'`);
      return filename;
    }
  }
  error(`could not find ExtractTextWebpackPlugin's generated .js file; available files: '${filenames.join()}'`);
};

const findJsFile = (options, htmlWebpackPluginOptions, compilation) => {
  const fileMatcher = (options.jsFilename)
    ? validateJsFile(options.jsFilename)
    : identifyJsFile(options.jsRegExp);
  const fileFilter = (options.chunks)
    ? onlyChunkFiles(options.chunks, htmlWebpackPluginOptions.chunks, compilation)
    : allFiles;
  if (fileFilter === NO_FILES) {
    return null;
  } else {
    return findGeneratedJsFile(fileMatcher, fileFilter, compilation);
  }
};

module.exports = findJsFile;
