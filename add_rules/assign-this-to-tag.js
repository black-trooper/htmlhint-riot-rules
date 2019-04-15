const rule = require('../rules/assign-this-to-tag');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}