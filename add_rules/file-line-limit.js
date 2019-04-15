const rule = require('../rules/file-line-limit');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}