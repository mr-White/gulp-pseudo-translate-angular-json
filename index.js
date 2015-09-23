/**
 * Create Pseudo Translated JSON from Any Other JSON
 * It does not matter how deep the JSON is, as long as it's composed of objects
 * and key value pairs. All values of key values pairs are pseudo translated,
 * but the keys and overall structure are maintained
 *
 * Intended to be used on Angular-Translate JSON files with namespace support
 *
 * @author   Michael Lage <michael@lagetech.com>
 * @date     September 23, 2015
 *
 * Pesudo Translation Code Inspired From:
 * @see  http://www.pseudolocalize.com
 */
'use strict';

// Dependencies
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var traverse = require('traverse');

// Go!
var PLUGIN_NAME = 'gulp-pseudo-translate-angular-json';
var config = {
  increasePercent: 30
};
var openMode = false; // flag for angularProtect
var stopTranslatingString = false;
var extraWords = " lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget urna laoreet, accumsan felis at, dapibus elit. In ut tempus mauris. Sed eget sagittis arcu, in condimentum purus. Curabitur vitae congue elit.";

// Translate Line & Check For Padding Config
function pseudoLine(translatedLine) {

  // Set flag to false
  stopTranslatingString = false;
  openMode = false;
  var pseudoTranslatedLine = pseudoWords(translatedLine);

  // To add padding or not ? Better not if it's an id link
  if (! stopTranslatingString) {
    var extraLength = Math.round(translatedLine.length * config.increasePercent / 100.0);

    pseudoTranslatedLine += pseudoWords(extraWords.substr(0, extraLength));
  }

  return pseudoTranslatedLine;
}


function angularProtect(i, text) {
  /**
   * Stop pseudoWords from destroying these:
   *
   * {{ SettingsCtrl.ProfileService.profile.mismatchedTravelNames.length }}
   * {{trophiesCount, select, 1{Trophy} other{Trophies}}} (only touch the plualized forms...!)
   * <a href=\"/web/agreement\" target=\"_blank\">User Agreement</a> (dont touch stuff inside < >)
   * @:common.home
   */

  // Take a look at the next character, how important is it, to the context of the moment ?
  if (openMode) {
    // look for closing tags
    switch(text.charAt(i)) {
      case '>':
        openMode = false;

      break;
      case '}':
        openMode = ! checkForInterpolateExpression(i, text, false);

      break;
    }
  } else {
    // look for opening tags
    switch(text.charAt(i)) {
      case '<':
        openMode = true;

      break;
      case '{':
        openMode = checkForInterpolateExpression(i, text, true);

      break;
      case '@':
        stopTranslatingString = checkForLinkedIds(i, text);
    }
  }
}

/**
 * [checkForLinkedIds description]
 * @param  {[type]} i    [description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function checkForLinkedIds(i, text) {
  if (text.charAt(i+1) === ':') {
    return true;
  }

  return false;
}

/**
 * [checkForInterpolateExpression description]
 * @param  {[type]} i     [description]
 * @param  {[type]} text  [description]
 * @param  {[type]} start [description]
 * @return {[type]}       [description]
 * @description
 *   Checks the next character in the text. Depending on 'start', it will look for either the
 *   end or beginning of an interpolate expression, {{ var }}. The idea is we want to protect the inside
 *   of these expression so they evaluate normamly in javascript. Hence the need to maintain openMode
 *
 *   When openMode is true, we are in an Interpolate expression that must not be converted into pseudo
 */
function checkForInterpolateExpression(i, text, start) {
  var checkFor = start ? '{' : '}';

  if (text.charAt(i+1) === checkFor)
  {
    return true;
  }

  return false;
}

function pseudoLetter(c) {
    switch (c) {
      case 'a': c = 'á'; break;
      case 'b': c = 'β'; break;
      case 'c': c = 'ç'; break;
      case 'd': c = 'δ'; break;
      case 'e': c = 'è'; break;
      case 'f': c = 'ƒ'; break;
      case 'g': c = 'ϱ'; break;
      case 'h': c = 'λ'; break;
      case 'i': c = 'ï'; break;
      case 'j': c = 'J'; break;
      case 'k': c = 'ƙ'; break;
      case 'l': c = 'ℓ'; break;
      case 'm': c = '₥'; break;
      case 'n': c = 'ñ'; break;
      case 'o': c = 'ô'; break;
      case 'p': c = 'ƥ'; break;
      case 'q': c = '9'; break;
      case 'r': c = 'ř'; break;
      case 's': c = 'ƨ'; break;
      case 't': c = 'ƭ'; break;
      case 'u': c = 'ú'; break;
      case 'v': c = 'Ʋ'; break;
      case 'w': c = 'ω'; break;
      case 'x': c = 'ж'; break;
      case 'y': c = '¥'; break;
      case 'z': c = 'ƺ'; break;
      case 'A': c = 'Â'; break;
      case 'B': c = 'ß'; break;
      case 'C': c = 'Ç'; break;
      case 'D': c = 'Ð'; break;
      case 'E': c = 'É'; break;
      case 'F': c = 'F'; break;
      case 'G': c = 'G'; break;
      case 'H': c = 'H'; break;
      case 'I': c = 'Ì'; break;
      case 'J': c = 'J'; break;
      case 'K': c = 'K'; break;
      case 'L': c = '£'; break;
      case 'M': c = 'M'; break;
      case 'N': c = 'N'; break;
      case 'O': c = 'Ó'; break;
      case 'P': c = 'Þ'; break;
      case 'Q': c = 'Q'; break;
      case 'R': c = 'R'; break;
      case 'S': c = '§'; break;
      case 'T': c = 'T'; break;
      case 'U': c = 'Û'; break;
      case 'V': c = 'V'; break;
      case 'W': c = 'W'; break;
      case 'X': c = 'X'; break;
      case 'Y': c = 'Ý'; break;
      case 'Z': c = 'Z'; break;
    }

    return c;
}

// Actual Translation. Goes through string, char by char,
// replacing regular letters with pseudo versions
function pseudoWords(text) {
  var translated = '';

  // Loop through string chars
  for (var i = 0; i < text.length; i++) {
    // Look for: {{ }} < >
    // To set or unset openMode
    if (!stopTranslatingString) {
      angularProtect(i, text);
    }

    if (stopTranslatingString || openMode) {
      translated += text.charAt(i);
    } else {
      translated += pseudoLetter(text.charAt(i));
    }
  }

  return translated;
}

// Plugin level function(dealing with files)
function pseudoTranslator(json, conf) {
  if (!json) {
    throw new PluginError(PLUGIN_NAME, 'JSON Translatable Data Is Missing');
  }

  // setup config
  config = conf || config;

  // Run your recursive function here to translate all values for all key-value pairs
  // found in 'json'
  return traverse(json).map(function(line) {
    if (typeof line === 'object') {
      // skip objects
    } else {
      this.update(pseudoLine(line));
    }
  });
}

// Exporting the plugin main function
module.exports = pseudoTranslator;
