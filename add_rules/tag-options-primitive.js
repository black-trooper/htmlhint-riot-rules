const rule = require('../rules/tag-options-primitive');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}