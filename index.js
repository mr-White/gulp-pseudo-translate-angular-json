/**
 * Create Pseudo Based Language JSON Files from Any Other JSON Dictionary File
 *  - To be used on Angular-Translate JSON files
 *
 * Pesudo Translation Code Inspired From:
 * @see  http://www.pseudolocalize.com
 *
 * For guidelines on Gulp Plugins:
 * @see  https://koglerjs.com/verbiage/gulp
 *
 * To Help Understand How To Read/Write to Files via Gulp:
 * @see  https://github.com/babel/gulp-babel
 */
'use strict';

// Dependencies
var gutil = require('gulp-util');
// var _ = require('lodash');
var PluginError = gutil.PluginError;
var traverse = require('traverse');

// Go!
var PLUGIN_NAME = 'gulp-pseudo-translate-angular-json';
var config = {
  increasePercent: 30
};


// Translate Line & Check For Padding Config
function pseudoLine(translatedLine) {
  var pseudoTranslatedLine = pseudoWord(translatedLine);

  var extraLength = Math.round(translatedLine.length * config.increasePercent / 100.0);

  var extraWords = " lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget urna laoreet, accumsan felis at, dapibus elit. In ut tempus mauris. Sed eget sagittis arcu, in condimentum purus. Curabitur vitae congue elit.";

  pseudoTranslatedLine += pseudoWord(extraWords.substr(0, extraLength));

  return pseudoTranslatedLine;
}

// Actual Translation. Goes through string, char by char,
// replacing regular letters with pseudo versions
function pseudoWord(before) {
  var after = '';

  for (var i = 0; i < before.length; i++) {
    var c = before.charAt(i);
    var out = '';
    switch (c) {
      case 'a': out = 'á'; break;
      case 'b': out = 'β'; break;
      case 'c': out = 'ç'; break;
      case 'd': out = 'δ'; break;
      case 'e': out = 'è'; break;
      case 'f': out = 'ƒ'; break;
      case 'g': out = 'ϱ'; break;
      case 'h': out = 'λ'; break;
      case 'i': out = 'ï'; break;
      case 'j': out = 'J'; break;
      case 'k': out = 'ƙ'; break;
      case 'l': out = 'ℓ'; break;
      case 'm': out = '₥'; break;
      case 'n': out = 'ñ'; break;
      case 'o': out = 'ô'; break;
      case 'p': out = 'ƥ'; break;
      case 'q': out = '9'; break;
      case 'r': out = 'ř'; break;
      case 's': out = 'ƨ'; break;
      case 't': out = 'ƭ'; break;
      case 'u': out = 'ú'; break;
      case 'v': out = 'Ʋ'; break;
      case 'w': out = 'ω'; break;
      case 'x': out = 'ж'; break;
      case 'y': out = '¥'; break;
      case 'z': out = 'ƺ'; break;
      case 'A': out = 'Â'; break;
      case 'B': out = 'ß'; break;
      case 'C': out = 'Ç'; break;
      case 'D': out = 'Ð'; break;
      case 'E': out = 'É'; break;
      case 'F': out = 'F'; break;
      case 'G': out = 'G'; break;
      case 'H': out = 'H'; break;
      case 'I': out = 'Ì'; break;
      case 'J': out = 'J'; break;
      case 'K': out = 'K'; break;
      case 'L': out = '£'; break;
      case 'M': out = 'M'; break;
      case 'N': out = 'N'; break;
      case 'O': out = 'Ó'; break;
      case 'P': out = 'Þ'; break;
      case 'Q': out = 'Q'; break;
      case 'R': out = 'R'; break;
      case 'S': out = '§'; break;
      case 'T': out = 'T'; break;
      case 'U': out = 'Û'; break;
      case 'V': out = 'V'; break;
      case 'W': out = 'W'; break;
      case 'X': out = 'X'; break;
      case 'Y': out = 'Ý'; break;
      case 'Z': out = 'Z'; break;
      default: out = c; break;
    }
    after += out;
  }

  return after;
}

// Plugin level function(dealing with files)
function pseudoTranslator(json, conf) {
  // gutil.log('hi');
  var whatIs = typeof json;
  gutil.log('type = '+whatIs);
  gutil.log('json.common.ignore = '+json.common.ignore);

  if (!json) {
    throw new PluginError(PLUGIN_NAME, 'JSON Translatable Data Is Missing');
  }

  // setup config
  config = conf || config;

  // Run your recursive function here to translate all values for all key-value pairs
  // found in 'json'
  var count = 0;
  var newJson = traverse(json).map(function(line) {
    if (typeof line === 'object') {
      // skip objects
    } else {
      count++;
      this.update(pseudoLine(line));
    }
  });

  gutil.log('lines counted: '+count);

  return newJson;
}

// Exporting the plugin main function
module.exports = pseudoTranslator;
