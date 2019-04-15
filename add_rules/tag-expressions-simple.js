const rule = require('../rules/tag-expressions-simple');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}