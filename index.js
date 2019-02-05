'use strict'

const glob = require('glob')
const path = require('path')

const defaultOptions = {
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

function loadRule(filepath, options) {
  options = Object.assign(defaultOptions, options)
  filepath = path.resolve(filepath);
  const ruleObj = require(filepath); // eslint-disable-line import/no-dynamic-require
  const ruleOption = options[ruleObj.id]; // We can pass a value to the rule
  return ruleOption ? ruleObj : null;
}

module.exports = function (options) {
  const rules = 'node_modules/htmlhint-riot-rules/rules/*.js'
  return glob.sync(rules, {
    dot: false,
    nodir: true,
    strict: false,
    silent: true
  }).map(file => {
    return loadRule(file, options)
  }).filter(rule => rule !== null)
}