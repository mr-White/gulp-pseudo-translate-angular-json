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
  increasePercent: 0
};
var tCC = 0; // translated characters count
var openMode = false; // flag for protect
var stopTranslatingString = false;
var openModeException = false;
var extraWords = " lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget urna laoreet, accumsan felis at, dapibus elit. In ut tempus mauris. Sed eget sagittis arcu, in condimentum purus. Curabitur vitae congue elit.";

// Translate Line & Check For Padding Config
function pseudoLine(translatedLine) {

  // Set flags to false
  stopTranslatingString = false;
  openMode = false;
  openModeException = false;
  tCC = 0;
  var pseudoTranslatedLine = pseudoWords(translatedLine);

  // To add padding or not ? Better not if it's an id link
  if (! stopTranslatingString) {
    if (tCC > 0) {
      var extraLength = Math.round(tCC * config.increasePercent / 100.0);

      pseudoTranslatedLine += pseudoWords(extraWords.substr(0, extraLength));
    }
  }

  return pseudoTranslatedLine;
}

/**
 * [protect description]
 * @description     Look for things to be skipped from Pseudo Translation
 * @param  {[type]} i    [description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
function protect(i, text) {
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
        if (openModeException) {
          openModeException = false;
        } else {
          openMode = ! checkForInterpolateExpression(i, text, false);
        }

      break;
      case '{':
        // maybe special case of no open mode
        openModeException = checkForNgMessageFormat(i, text);

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

function checkForNgMessageFormat(i, text) {
  // we need the next character to NOT be {, and there is at least } before the end of the text
  if (text.charAt(i+1) !== '{' && text.charAt(i-1) !== '{') {
    return true;
  }

  // {{openMode, select, 1{Test} other{Tests}}} test~

  return false;
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

/**
 * [pseudoLetter description]
 * @description     Translate Letter to Pseudo Letter
 * @param  {[type]} c [description]
 * @return {[type]}   [description]
 */
function pseudoLetter(c) {
    switch (c) {
      case 'a': c = 'á'; tCC++; break;
      case 'b': c = 'β'; tCC++; break;
      case 'c': c = 'ç'; tCC++; break;
      case 'd': c = 'δ'; tCC++; break;
      case 'e': c = 'è'; tCC++; break;
      case 'f': c = 'ƒ'; tCC++; break;
      case 'g': c = 'ϱ'; tCC++; break;
      case 'h': c = 'λ'; tCC++; break;
      case 'i': c = 'ï'; tCC++; break;
      case 'j': c = 'J'; tCC++; break;
      case 'k': c = 'ƙ'; tCC++; break;
      case 'l': c = 'ℓ'; tCC++; break;
      case 'm': c = '₥'; tCC++; break;
      case 'n': c = 'ñ'; tCC++; break;
      case 'o': c = 'ô'; tCC++; break; // One Óñè
      case 'p': c = 'ƥ'; tCC++; break;
      case 'q': c = '9'; tCC++; break; // Many Máñ¥
      case 'r': c = 'ř'; tCC++; break;
      case 's': c = 'ƨ'; tCC++; break;
      case 't': c = 'ƭ'; tCC++; break;
      case 'u': c = 'ú'; tCC++; break;
      case 'v': c = 'Ʋ'; tCC++; break;
      case 'w': c = 'ω'; tCC++; break;
      case 'x': c = 'ж'; tCC++; break;
      case 'y': c = '¥'; tCC++; break;
      case 'z': c = 'ƺ'; tCC++; break;
      case 'A': c = 'Â'; tCC++; break;
      case 'B': c = 'ß'; tCC++; break;
      case 'C': c = 'Ç'; tCC++; break;
      case 'D': c = 'Ð'; tCC++; break;
      case 'E': c = 'É'; tCC++; break;
      case 'F': c = 'F'; tCC++; break;
      case 'G': c = 'G'; tCC++; break;
      case 'H': c = 'H'; tCC++; break;
      case 'I': c = 'Ì'; tCC++; break;
      case 'J': c = 'J'; tCC++; break;
      case 'K': c = 'K'; tCC++; break;
      case 'L': c = '£'; tCC++; break;
      case 'M': c = 'M'; tCC++; break;
      case 'N': c = 'N'; tCC++; break;
      case 'O': c = 'Ó'; tCC++; break;
      case 'P': c = 'Þ'; tCC++; break;
      case 'Q': c = 'Q'; tCC++; break;
      case 'R': c = 'R'; tCC++; break;
      case 'S': c = '§'; tCC++; break;
      case 'T': c = 'T'; tCC++; break;
      case 'U': c = 'Û'; tCC++; break;
      case 'V': c = 'V'; tCC++; break;
      case 'W': c = 'W'; tCC++; break;
      case 'X': c = 'X'; tCC++; break;
      case 'Y': c = 'Ý'; tCC++; break;
      case 'Z': c = 'Z'; tCC++; break;
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
      protect(i, text);
    }

    if (stopTranslatingString || (openMode && !openModeException)) {
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
