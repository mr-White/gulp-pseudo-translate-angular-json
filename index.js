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

// Go!
var PLUGIN_NAME = 'gulp-pseudo-translate-angular-json';

// Dependencies
var gutil = require('gulp-util');
var data = require('gulp-data');
// var _ = require('lodash');
var PluginError = gutil.PluginError;

// Configuraiton Options
var increasePercent = 30; // 30%

function translate() {
  // read in file
  var lines = $('#before').val().split(/\n/);

  var after = '';

  // Translate line by line (each key: value pair)
  for (key in lines) { 
    var line = String(lines[key]).trim();
    after += PseudoLine(line) + '\n';
  }

  // Write out file
  $('#after').val(after);
}

function pseudoLine(before) {
  var after = pseudoWord(before);

  var extraLength = Math.round(before.length * increasePercent / 100.0);

  var extraWords = " lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget urna laoreet, accumsan felis at, dapibus elit. In ut tempus mauris. Sed eget sagittis arcu, in condimentum purus. Curabitur vitae congue elit.";

  after += pseudoWord(extraWords.substr(0, extraLength));

  if ($('#addbrackets').prop('checked')) {

    after = "[!!! " + after + " !!!]";
  }

  return after;
}

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
function pseudoTranslator(file, opts) {
  opts = opts || {};
  var data = opts.data || {};

  if (file.data) {
    data = _.extend(file.data, data);
  }

  if (!file) {
    throw new PluginError(PLUGIN_NAME, 'Missing Dictionary!');
  }

  gutil.log('Dictionary Found: ', file); // should be in JSON form

  return through.obj(function(file, enc, cb){
    file.contents = {'hi': 'hi!'};
    // if (file.isNull()) {
    //   // return empty file
    //   return cb(null, file);
    // } else if (file.isBuffer()) {
    //   file.contents = Buffer.concat([prefixText, file.contents]);
    // }
    // if (file.isStream()) {
    //   file.contents = file.contents.pipe(prefixStream(prefixText));
    // }

    cb(null, file);
  });
  // fileName = new Buffer(fileName); // allocate ahead of time

  // // Creating a stream through which each file will pass
  // return through.obj(function(file, enc, cb) {
  //   if (file.isNull()) {
  //     // return empty file
  //     return cb(null, file);
  //   }
  //   if (file.isBuffer()) {
  //     file.contents = Buffer.concat([prefixText, file.contents]);
  //   }
  //   if (file.isStream()) {
  //     file.contents = file.contents.pipe(prefixStream(prefixText));
  //   }

  //   cb(null, file);

  // });

}

// Exporting the plugin main function
module.exports = pseudoTranslator;