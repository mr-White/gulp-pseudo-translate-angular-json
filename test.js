/**
 * Test Gulp Plugin
 *
 * I'm not going to write tests for traverse, but instead focus on the actual pseudo translating code
 *
 * @todo  write more tests, angular specific stuff (once code written)
 */

var assert = require('assert');
var pseudoTranslator = require('./');

describe('gulp-pseudo-translate-angular-json', function() {
  describe('Text to Pseudo conversion', function() {

    it('converts a regular line of text into its pseudo version', function(done) {
      // Create a prefixer plugin stream
      var testJSON = {
      	'helloWorld': 'Hello World'
      };

      // Translate it with no padding
      var translatedJson = pseudoTranslator(testJSON, {increasePercent: 0}); // 0 padding

      // It should equal this
      assert.equal(translatedJson.helloWorld, 'Hèℓℓô Wôřℓδ');

      done();
    });
  });
});