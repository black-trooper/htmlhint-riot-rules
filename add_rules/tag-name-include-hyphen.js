const rule = require('../rules/tag-name-include-hyphen');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}