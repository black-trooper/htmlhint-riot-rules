const id = 'assign-this-to-tag'
const esprima = require('esprima');

module.exports = {
  id,
  description: 'Assign this to tag.',
  init: function (parser, reporter, options) {
    var self = this;
    function isAssignThisToTag(ast, name) {
      return ast.body.some(body => {
        return body.type === 'VariableDeclaration'
          && body.declarations.some(declaration => {
            return declaration.type === 'VariableDeclarator'
              && declaration.id
              && declaration.id.type === 'Identifier'
              && declaration.id.name === name || 'tag'
              && declaration.init
              && declaration.init.type === 'ThisExpression'
          })
      })
    }
    function hasThisToken(code) {
      const tokens = esprima.tokenize(code)
      return tokens.some(token => token.type === 'Keyword' && token.value === 'this')
    }
    function isUseThisOnTopLevel(ast) {
      return ast.body.some(body => {
        return body.type === 'ExpressionStatement'
          && body.expression
          && body.expression.type === 'AssignmentExpression'
          && body.expression.left
          && body.expression.left.object
          && body.expression.left.object.type === 'ThisExpression'
      })
    }
    parser.addListener('cdata', function (event) {
      if (event.tagName.toLowerCase() !== 'script') {
        return
      }
      const code = event.raw.replace(/\t/g, ' ');
      if (!hasThisToken(code)) {
        return
      }
      const ast = esprima.parse(code)
      if (ast.type !== 'Program') {
        return
      }
      if (options.force || !isAssignThisToTag(ast, options.name) || isUseThisOnTopLevel(ast)) {
        reporter.warn('Assign this to tag.', event.line, event.col, self, event.raw);
      }
    });
  }
}