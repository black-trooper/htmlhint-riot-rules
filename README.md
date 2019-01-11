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

const htmlhintRiotRules = require('htmlhint-riot-rules')

module.exports = {
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.html/,
      loader: 'htmlhint-loader',
      exclude: /node_modules/,
      options: {
        customRules: htmlhintRiotRules()
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
|avoid-tag-parent|[Avoid tag.parent](https://github.com/voorhoede/riotjs-style-guide#avoid-tagparent)|warn|


## Options
You can specify rules to disable with JSON arguments. 
By default all rules are turned on and it is up to you to disable them.

```javascript
var htmlhintRiotRules = require('htmlhint-riot-rules')

var customRules = htmlhintRiotRules({
  'avoid-tag-parent': false
})
```
