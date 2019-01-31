const id = 'harness-your-tag-options'
const esprima = require('esprima');

module.exports = {
  id,
  description: 'Harness your tag options.',
  init: function (parser, reporter, options) {
    var self = this;
    const regex = /\{.*opts.*?\}/;
    function isAssignmentByOpts(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.right.type === 'MemberExpression'
        && body.expression.right.object.name === 'opts'
    }
    function isDeclarationInitByOpts(body) {
      return body.type === 'VariableDeclaration'
        && body.declarations.some(declaration => {
          return declaration.type === 'VariableDeclarator'
            && declaration.init.type === 'MemberExpression'
            && declaration.init.object.name === 'opts'
        })
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
    parser.addListener('tagstart', function (event) {
      var attrs = event.attrs,
        attr,
        col = event.col + event.tagName.length + 1;
      for (var i = 0, l = attrs.length; i < l; i++) {
        attr = attrs[i];

        if (regex.test(attr.value) === true) {
          reporter.warn('Use defaults for option values. e.g.) tag.xxx = opts.xxx || \'defaults\'.', event.line, event.col, self, event.raw);
        }
      }
    });
    parser.addListener('text', function (event) {
      if (regex.test(event.raw) === true) {
        reporter.warn('Use defaults for option values. e.g.) tag.xxx = opts.xxx || \'defaults\'.', event.line, event.col, self, event.raw);
      }
    });
    parser.addListener('cdata', function (event) {
      if (event.tagName.toLowerCase() !== 'script') {
        return
      }
      const code = event.raw.replace(/\t/g, ' ');
      const ast = esprima.parse(code, { loc: true })

      ast.body.filter(body => isAssignmentByOpts(body) || isDeclarationInitByOpts(body)).forEach(body => {
        warn('Use defaults for option values. e.g.) tag.xxx = opts.xxx || \'defaults\'.', event, body.loc.start.line, body.loc.start.column)
      })
    });
  }
}