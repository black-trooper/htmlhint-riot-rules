const id = 'properties-and-methods-order'
const esprima = require('esprima');

module.exports = {
  id,
  description: 'Put tag properties and methods on top',
  init: function (parser, reporter, options) {
    var self = this;
    function isAssignThisToTag(body) {
      return body.type === 'VariableDeclaration'
        && body.declarations.length == 1
        && body.declarations[0].type === 'VariableDeclarator'
        && body.declarations[0].id.type === 'Identifier'
        && body.declarations[0].id.name === 'tag'
        && body.declarations[0].init.type === 'ThisExpression'
    }
    function isTagProperty(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'MemberExpression'
        && body.expression.left.object.name === 'tag'
        && (body.expression.right.type === 'Literal'
          || body.expression.right.type === 'ArrayExpression'
          || body.expression.right.type === 'ObjectExpression')
    }
    function isTagMethod(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'MemberExpression'
        && body.expression.left.object.name === 'tag'
        && body.expression.right.type === 'Identifier'
    }
    function isMultiLinerTagMethod(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'MemberExpression'
        && body.expression.left.object.name === 'tag'
        && (body.expression.right.type === 'FunctionExpression'
          || body.expression.right.type === 'ArrowFunctionExpression')
    }
    function isFunction(body) {
      return body.type === 'FunctionDeclaration'
    }
    function isVariable(body) {
      return body.type === 'VariableDeclaration' && !isAssignThisToTag(body)
    }
    function isProperty(body) {
      return !isVariable(body) && !isFunction(body)
        && !isTagProperty(body) && !isTagMethod(body) && !isAssignThisToTag(body)
    }
    function extractRaw(raw, line) {
      return raw.split(/\r\n|\r|\n/)[line - 1]
    }
    function extractPropertyName(target) {
      if (target.type === 'MemberExpression') {
        if (target.object.type === 'Identifier') {
          return `${target.object.name}.${target.property.name}`
        }
        return `${extractPropertyName(target.object)}.${target.property.name}`
      }
      return target.name
    }
    function warn(message, event, body) {
      const line = event.line + body.loc.start.line - 1
      const col = (body.loc.start.line === 1 ? event.col : 0) + body.loc.start.column
      const raw = extractRaw(event.raw, body.loc.start.line)
      reporter.warn(message, line, col, self, raw);
    }

    parser.addListener('cdata', function (event) {
      if (event.tagName.toLowerCase() !== 'script') {
        return
      }
      const code = event.raw.replace(/\t/g, ' ');
      const ast = esprima.parseModule(code, { loc: true })
      if (ast.type !== 'Program') {
        return
      }

      if (ast.body.length === 0) {
        return
      }
      if (!isAssignThisToTag(ast.body[0])) {
        warn('Put tag declaration on top.', event, ast.body[0]);
      }

      let last
      ast.body.forEach(body => {
        if (isMultiLinerTagMethod(body)) {
          warn('Keeping tag method declaration a one-liner.', event, body);
        }

        if (!last) {
          last = body
          return
        }

        if (isTagProperty(body)) {
          if (isTagProperty(last)) {
            if (body.expression.left.property.name < last.expression.left.property.name) {
              // Alphabetizing
              warn('Expected tag properties to be in order.', event, body);
            }
          }
          else if (!isAssignThisToTag(last)) {
            warn('Put tag properties after tag declaration.', event, body);
          }
        }

        else if (isTagMethod(body)) {
          if (isTagMethod(last)) {
            if (body.expression.left.property.name < last.expression.left.property.name) {
              // Alphabetize
              warn('Expected tag methods to be in order.', event, body);
            }
          }
          else if (!isTagProperty(last) && !isAssignThisToTag(last)) {
            warn('Put tag methods after tag declaration and tag properties.', event, body);
          }
        }

        else if (isVariable(body)) {
          if (isVariable(last)) {
            if (body.declarations[0].id.name < last.declarations[0].id.name) {
              // Alphabetizing
              warn('Expected declarations to be in order.', event, body);
            }
          }
          else if (!isTagMethod(last) && !isTagProperty(last) && !isAssignThisToTag(last)) {
            warn('Put declarations after tag properties and tag methods.', event, body);
          }
        }

        else if (isProperty(body)) {
          if (isProperty(last)) {
            const propertyName = extractPropertyName(body.expression.left)
            const lastPropertyName = extractPropertyName(last.expression.left)
            if (propertyName < lastPropertyName) {
              // Alphabetizing
              warn('Expected properties to be in order.', event, body);
            }
          }
          else if (!isVariable(last) && !isTagMethod(last) && !isTagProperty(last)
            && !isAssignThisToTag(last)) {
            warn('Put properties after declarations.', event, body);
          }
        }

        else if (isFunction(body)) {
          if (isFunction(last)) {
            if (body.id.name < last.id.name) {
              // Alphabetizing
              warn('Expected functions to be in order.', event, body);
            }
          }
        }

        last = body
      })
    });
  }
}