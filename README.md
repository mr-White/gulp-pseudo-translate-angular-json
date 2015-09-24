# gulp-pseudo-translate-angular-json
Translate values of JSON file key value pairs into Pseudo for [Angular-Translate](https://angular-translate.github.io/).

## Description
Takes JSON and traverses the entire JSON tree for all key-value pairs. When it finds a key value pair, it pseudo translates the value and updates the key value pair. Therefore, the returned JSON from this plugin is in the same structure as the JSON provided. The only difference is all the key value pairs got updates with pseudo translations. Therefore, to properly use this plugin, you are going to want to use it in conjunction with a couple others.

## Supports {{ angularExpressions }}, ngMessageFormat, HTML, and Linked Id's, [Angular-Translate](https://angular-translate.github.io/) Namespacing
This package is intended for [Angular-Translate](https://angular-translate.github.io/) users. You are able to link to another key in your JSON via [Angular-Translate](https://angular-translate.github.io/), and this plugin [supports those links](https://angular-translate.github.io/docs/#/guide/02_getting-started). They will not be converted to psuedo characters. Same thing for HTML. Also, Angular Interpolate Expressions are skipped. Stuff that looks like: {{ someVar }} are skipped so the Pseudo language does not break your AngularJS app. Finally, there is a special exception for Pluralization using ngMessageFormat. Words in the [ngMessageFormat](https://docs.angularjs.org/api/ngMessageFormat/service/$$messageFormat) are translated into Pseudo!

Since we traverse the JSON object directly and update the values of the object, we maintain the same structure of JSON so [Angular-Translate](https://angular-translate.github.io/)'s namespacing feature is supported naturally.

English Dictionary Value:
```javascript
'count': '{{count, select, 1{One} other{Many}}}',
'linkedIdEx': '@:common.hello'
```

Pseudo Translated Version:
```javascript
'count': '{{count, select, 1{Óñè} other{Máñ¥}}}',
'linkedIdEx': '@:common.hello'
```

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

That code above will count the number of characters translated, then take 30% of that number and add that many pseudo characters to each string. That way, you can adjust how much stress you want to put your UI under while testing.

As more config options are added, there will be ways to override the defaults through this object.

## Notes
I did not try this with an array and it will probably error out. This can be added for others, if desired.

## Testing
If you want to try out the tests included. Run in a terminal at the root folder of the project:
```javascript
npm install -dev
npm test
```

Included are some Mocha tests that tests the main features.