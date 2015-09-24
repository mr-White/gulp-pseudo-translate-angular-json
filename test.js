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

  // Simple Test (Text Conversion to Pseudo)
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

  // Test for skipping Angular Expressions but still pseudo translate text outside 
  describe('Text to Pseudo Conversion but Skip Angular Expressions', function(){
  	it('converts a regular line of text with an Angular Expression into pseudo while maintaining the integrity of the Angular Expression', function(done){
  		var testJSON = {
  			'angularExpressionTest': '{{cobrandName}} is awesome!'
  		};

  		// Translate it with no padding
	    var translatedJson = pseudoTranslator(testJSON, {increasePercent: 0}); // 0 padding

	    // It should equal this
	    assert.equal(translatedJson.angularExpressionTest, '{{cobrandName}} ïƨ áωèƨô₥è!');

	    done();
  	});
  });

  // Test for skipping linked ID's (an Angular-Translate feature, supported by this plugin)
  describe('Do not convert ID links for Angular-Translate', function() {
  	it('recognizes an ID link and skips it from pseudo conversion', function(done){
  		var testJSON = {
  			'common': {
  				'welcomeToTheSite': 'Welcome to the Site'
  			},
  			'pointToAnotherID': '@:common.welcomeToTheSite'
  		};

  		// Pseudo translate
  		var translatedJson = pseudoTranslator(testJSON, {increasePercent: 0});

  		// The link should be the same, but the another key value pair should be converted
  		assert.equal(translatedJson.common.welcomeToTheSite, 'Wèℓçô₥è ƭô ƭλè §ïƭè');
  		assert.equal(translatedJson.pointToAnotherID, '@:common.welcomeToTheSite');

  		done();
  	});
  });
});