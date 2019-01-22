const id = 'put-tag-properties-and-methods-on-top'
const esprima = require('esprima');

module.exports = {
  id,
  description: 'Put tag properties and methods on top',
  init: function (parser, reporter, options) {
    var self = this;
    parser.addListener('cdata', function (event) {
      if (event.tagName.toLowerCase() !== 'script') {
        return
      }
      const code = event.raw.replace(/\t/g, ' ');
      const ast = esprima.parse(code)
      if (ast.type !== 'Program') {
        return
      }

      let last
      ast.body.forEach(body => {
        if (!last) {
          last = body
          return
        }

        // const, let, var
        if (body.type === 'VariableDeclaration') {
          if (body.type !== last.type) {
            reporter.warn('Put tag properties and methods on top.', event.line, event.col, self, event.raw);
          }
          else if (body.kind < last.kind) {
            // in order const, let, var
            reporter.warn('Alphabetizing the properties and methods .', event.line, event.col, self, event.raw);
          }
          else if (body.declarations.length > 0) {
            // Multiple declarations
            let lastDeclaration
            body.declarations.forEach(declaration => {
              if (!lastDeclaration) {
                lastDeclaration = declaration
                return
              }
              if (declaration.id.name < lastDeclarations.id.name) {
                reporter.warn('Expected properties to be in order.', event.line, event.col, self, event.raw);
              }
            })
          }
          else if (body.declarations[0].id.name < last.declarations[0].id.name) {
            // Alphabetizing
            reporter.warn('Expected properties to be in order.', event.line, event.col, self, event.raw);
          }
        }

        // tag.xxx
        else if (body.type === 'ExpressionStatement') {
          if (body.type !== last.type && last.type !== 'VariableDeclaration') {
            reporter.warn('Put tag properties and methods on top.', event.line, event.col, self, event.raw);
          }
        }

        // function
        else if (body.type === 'FunctionDeclaration') {
          if (last.type !== last.type && last.type !== 'ExpressionStatement') {
            reporter.warn('Put tag properties and methods on top.', event.line, event.col, self, event.raw);
          }
        }

        last = body
      })
    });
  }
}