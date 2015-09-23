# gulp-pseudo-translate-angular-json
Translate values of JSON file key value pairs into Pseudo for Angular-Translate 

## Description
Takes JSON and traverses the entire JSON tree for all key-value pairs. When it finds a key value pair, it pseudo translates the value and updates the key value pair. Therefore, the returned JSON from this plugin is in the same structure as the JSON provided. The only difference is all the key value pairs got updates with pseudo translations. Therefore, to properly use this plugin, you are going to want to use it in conjunction with a couple others.

## Setup the Task
You are going to want to include 3 gulp plugins in your main gulpfile.js:

var pseudoTranslator = require('gulp-pseudo-translate-angular-json');
var jeditor = require('gulp-json-editor');
var rename = require('gulp-rename');

Then you are going to want to create and invoke a task like the following:

/**
 * @name   i18n:pseudo
 * @desc   Read English JSON Dictionary and Write Pseudo JSON Dictionary File
 */
gulp.task('i18n:pseudo', function() {
  gulp.src(paths.src.i18n.dictionary + '/locale-en_US.json') // url to source file
  .pipe(jeditor(function(json) {
      return pseudoTranslator(json, {increasePercent: 50});
    }))
  .pipe(rename('locale-pseudo.json')) // destination file name
  .pipe(gulp.dest(paths.src.i18n.dictionary)); // destination folder
});

First, the JSON source file is supplied as a stream (Vinyl Object). We pipe that into jeditor so we can feed pure JSON to this plugin. Then we rename the streamed file and save the updated json specified in the folder of gulp.dest().

## Notes
I did not try this with an array and it will probably error out. This can be added for others, if desired.