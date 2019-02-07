# htmlhint-riot-rules

[![npm version](https://badge.fury.io/js/htmlhint-riot-rules.svg)](https://badge.fury.io/js/htmlhint-riot-rules)
[![Build Status](https://travis-ci.org/black-trooper/htmlhint-riot-rules.svg?branch=master)](https://travis-ci.org/black-trooper/htmlhint-riot-rules)
[![Coverage Status](https://coveralls.io/repos/github/black-trooper/htmlhint-riot-rules/badge.svg)](https://coveralls.io/github/black-trooper/htmlhint-riot-rules)
[![GitHub license](https://img.shields.io/github/license/black-trooper/htmlhint-riot-rules.svg)](https://github.com/black-trooper/htmlhint-riot-rules/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/dm/htmlhint-riot-rules.svg)](https://www.npmtrends.com/htmlhint-riot-rules)

HTMLHint custom rules for Riot.js

## Install
```
npm install htmlhint-riot-rules
```

## Useage

### with [htmlhint-loader](https://github.com/htmlhint/htmlhint-loader)
```javascript
// webpack.config.js

var htmlhintRiotRules = require('htmlhint-riot-rules')

module.exports = {
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.tag\.html/,
      loader: 'htmlhint-loader',
      exclude: /node_modules/,
      options: {
        customRules: htmlhintRiotRules(),
        'file-line-limit': 100,
        'tag-name-include-hyphen': true,
        'use-script-inside-tag': true,
        'tag-expressions-simple': true,
        'tag-options-primitive': true,
        'assign-this-to-tag': true,
        'properties-and-methods-order': true,
        'fake-es6-syntax-disabled': true,
        'tag-parent-disabled': true,
        'use-each-in-syntax': true
      }
    }]
  }
}
```


### with [gulp-htmlhint](https://github.com/bezoerb/gulp-htmlhint)
```javascript
// gulp.config.js

var gulp = require('gulp');
var htmlhint = require("gulp-htmlhint");
var htmlhintRiotRules = require('htmlhint-riot-rules')

gulp.src("./src/*.tag.html")
  .pipe(htmlhint('.htmlhintrc', htmlhintRiotRules()))
```

## Rules
|ID|Description|Level|
|--|-----------|-----|
|file-line-limit|[Module based development](https://github.com/voorhoede/riotjs-style-guide#module-based-development)|warn|
|tag-name-include-hyphen|[Tag module names](https://github.com/voorhoede/riotjs-style-guide#tag-module-names)|error|
|use-script-inside-tag|[Use &lt;script&gt; inside tag](https://github.com/voorhoede/riotjs-style-guide#use-script-inside-tag)|error|
|tag-expressions-simple|[Keep tag expressions simple](https://github.com/voorhoede/riotjs-style-guide#keep-tag-expressions-simple)|warn|
|tag-options-primitive|[Keep tag options primitive](https://github.com/voorhoede/riotjs-style-guide#keep-tag-options-primitive)|warn|
|assign-this-to-tag|[Assign this to tag](https://github.com/voorhoede/riotjs-style-guide#assign-this-to-tag)|warn|
|properties-and-methods-order|[Put tag properties and methods on top](https://github.com/voorhoede/riotjs-style-guide#put-tag-properties-and-methods-on-top)|warn|
|fake-es6-syntax-disabled|[Avoid fake ES6 syntax](https://github.com/voorhoede/riotjs-style-guide#avoid-fake-es6-syntax)|warn|
|tag-parent-disabled|[Avoid `tag.parent`](https://github.com/voorhoede/riotjs-style-guide#avoid-tagparent)|warn|
|use-each-in-syntax|[Use `each ... in` syntax](https://github.com/voorhoede/riotjs-style-guide#use-each--in-syntax)|warn|


## Options
You can specify rules to disable with JSON arguments. 
By default all rules are turned on and it is up to you to disable them.

```javascript
var htmlhintRiotRules = require('htmlhint-riot-rules')

var customRules = htmlhintRiotRules({
  'avoid-tag-parent': false
})
```
