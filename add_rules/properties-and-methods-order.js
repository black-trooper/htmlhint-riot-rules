const rule = require('../rules/properties-and-methods-order');

module.exports = function (HTMLHint) {
  HTMLHint.addRule(rule)
}