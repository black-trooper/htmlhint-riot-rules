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
    function isImport(body) {
      return body.type === 'ImportDeclaration'
    }
    function isTagProperty(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'MemberExpression'
        && (body.expression.left.object.name === 'tag' || body.expression.left.object.type === 'ThisExpression')
        && (body.expression.right.type === 'Literal'
          || body.expression.right.type === 'ArrayExpression'
          || body.expression.right.type === 'ObjectExpression')
    }
    function isTagMethod(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'MemberExpression'
        && (body.expression.left.object.name === 'tag' || body.expression.left.object.type === 'ThisExpression')
        && body.expression.right.type === 'Identifier'
        || isTagCallExpression(body)
    }
    function isTagCallExpression(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'CallExpression'
        && body.expression.callee.type === 'MemberExpression'
        && (body.expression.callee.object.name === 'tag' || body.expression.callee.object.type === 'ThisExpression')
    }
    function isMultiLinerTagMethod(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'MemberExpression'
        && (body.expression.left.object.name === 'tag' || body.expression.left.object.type === 'ThisExpression')
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
      return isIdentifierProperty(body) || isMemberProperty(body) || isCallExpression(body)
    }
    function isIdentifierProperty(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'Identifier'
        && (body.expression.right.type === 'Literal'
          || body.expression.right.type === 'ArrayExpression'
          || body.expression.right.type === 'ObjectExpression')
    }
    function isMemberProperty(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.left.type === 'MemberExpression'
        && body.expression.left.object.name !== 'tag'
        && (body.expression.right.type === 'Literal'
          || body.expression.right.type === 'ArrayExpression'
          || body.expression.right.type === 'ObjectExpression')
    }
    function isCallExpression(body) {
      return body.type === 'ExpressionStatement'
        && body.expression.type === 'CallExpression'
        && body.expression.callee.type === 'MemberExpression'
        && (body.expression.callee.object.name !== 'tag' && body.expression.callee.object.type !== 'ThisExpression')
    }
    function extractRaw(raw, line) {
      return raw.split(/\r\n|\r|\n/)[line - 1]
    }
    function extractMethodName(body) {
      if (body.expression.type === 'CallExpression') {
        return body.expression.callee.property.name
      }
      return body.expression.left.property.name
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

      let last
      ast.body.forEach(body => {
        if (isMultiLinerTagMethod(body)) {
          warn('Keeping tag method declaration a one-liner.', event, body);
        }

        if (!last) {
          last = body
          return
        }

        if (isImport(body)) {
          if (isImport(last)) {
            if (body.source.value < last.source.value) {
              // Alphabetizing
              warn('Import sources within a group must be alphabetized.', event, body);
            }
          }
          else {
            warn('Put import declarations to top.', event, body);
          }
        }

        else if (isAssignThisToTag(body)) {
          if (!isImport(last)) {
            warn('Put tag declaration on top or after import declarations.', event, body);
          }
        }

        else if (isTagProperty(body)) {
          if (isTagProperty(last)) {
            if (body.expression.left.property.name < last.expression.left.property.name) {
              // Alphabetizing
              warn('Tag properties must be alphabetized.', event, body);
            }
          }
          else if (!isAssignThisToTag(last) && !isImport(last)) {
            warn('Put tag properties after tag declaration.', event, body);
          }
        }

        else if (isTagMethod(body)) {
          if (isTagMethod(last)) {
            if (extractMethodName(body) < extractMethodName(last)) {
              // Alphabetize
              warn('Tag methods must be alphabetized.', event, body);
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
              warn('Declarations must be alphabetized.', event, body);
            }
          }
          else if (!isTagMethod(last) && !isTagProperty(last) && !isAssignThisToTag(last)) {
            warn('Put declarations after tag properties and tag methods.', event, body);
          }
        }

        else if (isProperty(body)) {
          if (isProperty(last)) {
            const propertyName = extractPropertyName(body.expression.left ? body.expression.left : body.expression.callee)
            const lastPropertyName = extractPropertyName(last.expression.left ? last.expression.left : last.expression.callee)
            if (propertyName < lastPropertyName) {
              // Alphabetizing
              warn('Properties must be alphabetized.', event, body);
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
              warn('Functions must be alphabetized.', event, body);
            }
          }
        }

        last = body
      })
    });
  }
}