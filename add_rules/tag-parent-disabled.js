const rule = require('../rules/tag-parent-disabled');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}