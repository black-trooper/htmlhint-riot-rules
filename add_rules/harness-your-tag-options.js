const rule = require('../rules/harness-your-tag-options');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}