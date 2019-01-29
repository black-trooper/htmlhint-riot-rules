const id = 'avoid-fake-es6-syntax'
const esprima = require('esprima');

module.exports = {
  id,
  description: 'Avoid fake ES6 syntax.',
  init: function (parser, reporter, options) {
    var self = this;
    function isVariable(body) {
      return body.type === 'VariableDeclaration'
    }
    function isProperty(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'Identifier'
    }
    function extractRaw(raw, line) {
      return raw.split(/\r\n|\r|\n/)[line - 1]
    }
    function warn(message, event, startLine, startCol) {
      const line = event.line + startLine - 1
      const col = (startLine === 1 ? event.col : 0) + startCol
      const raw = extractRaw(event.raw, startLine)
      reporter.warn(message, line, col, self, raw);
    }
    parser.addListener('cdata', function (event) {
      if (event.tagName.toLowerCase() !== 'script') {
        return
      }
      const code = event.raw.replace(/\t/g, ' ');

      try {
        const ast = esprima.parse(code, { loc: true })
        const declarations = ast.body.filter(body => isVariable(body)).reduce((acc, body) => acc.concat(body.declarations.map(declaration => declaration.id.name)), []);

        ast.body.filter(body => isProperty(body)).forEach(body => {
          if (!declarations.includes(body.expression.left.name)) {
            warn('Use tag.propetyName = instead of magic propertyName = \'\' syntax.', event, body.loc.start.line, body.loc.start.column)
          }
        })
      } catch (e) {
        if (e.description === 'Unexpected token {') {
          warn('Use tag.methodName = instead of magic methodName() { } syntax.', event, e.lineNumber, e.index)
        }
      }
    });
  }
}