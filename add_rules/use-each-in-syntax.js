const rule = require('../rules/use-each-in-syntax');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}