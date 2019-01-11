'use strict'

const glob = require('glob')
const path = require('path')

const defaultOptions = {
  'avoid-tag-parent': true,
  'each-use-in-syntax': true,
  'script-inside-tag': true,
  'styles-external-files': true
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