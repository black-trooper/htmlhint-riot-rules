const id = 'tag-expressions-simple';
const esprima = require('esprima');

module.exports = {
  id,
  description: 'Keep tag expressions simple',
  init: function (parser, reporter, options) {
    var self = this;
    const limit = options > 1 ? options : 10

    // RegExp Lookbehind Assertions. requires Node.js 9.11.2 or later
    const regex = /(?<!\\){.*?[^\\]}/g;
    parser.addListener('text', function (event) {
      const expressions = event.raw.match(regex)
      if (!expressions) {
        return
      }
      expressions.forEach(expression => {
        const code = expression.replace('\{', '').replace('\}', '')
        const tokenSize = Object.keys(esprima.tokenize(code)).length
        if (tokenSize > limit) {
          reporter.warn(`Must Keep tag expressions simple. Token size is ${tokenSize} but limit ${limit}`, event.line, event.col, self, event.raw);
        }
      })
    });
  }
}