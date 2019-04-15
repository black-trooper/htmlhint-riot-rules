const rule = require('../rules/use-script-inside-tag');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}