const rule = require('../rules/fake-es6-syntax-disabled');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}