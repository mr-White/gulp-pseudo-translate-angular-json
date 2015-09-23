# gulp-pseudo-translate-angular-json
Translate values of JSON file key value pairs into Pseudo for Angular-Translate 

## Description
Takes JSON and traverses the entire JSON tree for all key-value pairs. When it finds a key value pair, it pseudo translates the value and updates the key value pair. Therefore, the returned JSON from this plugin is in the same structure as the JSON provided. The only difference is all the key value pairs got updates with pseudo translations. Therefore, to properly use this plugin, you are going to want to use it in conjunction with a couple others.

## Supports {{ }}, HTML, and Linked Id's
This package is intended for Angular-Translate users. You are able to link to another key in your JSON via Angular-Translate, and this plugin supports those links. They will not be converted to psuedo characters. Same thing for HTML and found Angular Interpolate Expressions {{ }}.

## Setup the Task
You are going to want to include 3 gulp plugins in your main gulpfile.js:

```javascript
var pseudoTranslator = require('gulp-pseudo-translate-angular-json');
var jeditor = require('gulp-json-editor');
var rename = require('gulp-rename');
```

Then you are going to want to create and invoke a task like the following:

```javascript
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
```

First, the JSON source file is supplied as a stream (Vinyl Object). We pipe that into jeditor so we can feed pure JSON to this plugin. The plugin does its magic (translates all key values pairs to pseudo). Then we rename the streamed file and save the updated json specified in the folder of gulp.dest().

## Parameters & Configuration
```javascript
pseudoTranslator(json, config)
```
json is required.
The config param is optional. 

The json is an object with objects inside objects containing key-value pairs to be translated. 

The config object is there only if you want to override a default config value. Currently, the default "padding" for every word translated into pseudo is 0%. So 0% of the string's length is added in random pseudo characters. You can override it, by passing in:
```javascript
var config = {increasePercent: 30};

pseudoTranslate(json, config);
```

30% of the string's length will be added in pseudo characters.

As more config options are added, there will be ways to override the defaults through this object.

## Notes
I did not try this with an array and it will probably error out. This can be added for others, if desired.