const id = 'tag-options-primitive';
const esprima = require('esprima');

module.exports = {
  id,
  description: 'Keep tag options primitive.',
  init: function (parser, reporter) {
    var self = this;
    var regex = /\{.*opts\..*\..*?\}/;
    function isAssignTagProperty(body) {
      if (body.type === 'ExpressionStatement'
        && body.expression.type === 'AssignmentExpression'
        && body.expression.right.type === 'MemberExpression') {
        const propertyName = extractPropertyName(body.expression.right)
        return propertyName.startsWith('opts') && propertyName.split('.').length > 2
      }
      return false
    }
    function isAssignProperty(body) {
      if (body.type !== 'VariableDeclaration') {
        return false
      }
      return body.declarations.filter(declaration => {
        return declaration.type === 'VariableDeclarator'
          && declaration.init.type === 'MemberExpression'
      }).some(declaration => {
        const propertyName = extractPropertyName(declaration.init)
        return propertyName.startsWith('opts') && propertyName.split('.').length > 2
      })
    }
    function extractPropertyName(target) {
      if (target.object.type === 'Identifier') {
        return `${target.object.name}.${target.property.name}`
      }
      return `${extractPropertyName(target.object)}.${target.property.name}`
    }
    function warn(message, event, body) {
      const line = event.line + body.loc.start.line - 1
      const col = (body.loc.start.line === 1 ? event.col : 0) + body.loc.start.column
      const raw = extractRaw(event.raw, body.loc.start.line)
      reporter.warn(message, line, col, self, raw);
    }
    function extractRaw(raw, line) {
      return raw.split(/\r\n|\r|\n/)[line - 1]
    }
    parser.addListener('tagstart', function (event) {
      var attrs = event.attrs,
        attr,
        col = event.col + event.tagName.length + 1;
      for (var i = 0, l = attrs.length; i < l; i++) {
        attr = attrs[i];

        if (regex.test(attr.value) === true) {
          reporter.warn('The attribute [ ' + attr.name + ' ] keep tag options primitive.', event.line, col + attr.index, self, attr.raw);
        }
      }
    });
    parser.addListener('text', function (event) {
      if (regex.test(event.raw) === true) {
        reporter.warn('Keep tag options primitive.', event.line, event.col, self, event.raw);
      }
    });
    parser.addListener('cdata', function (event) {
      if (event.tagName.toLowerCase() !== 'script') {
        return
      }
      const code = event.raw.replace(/\t/g, ' ');
      const ast = esprima.parse(code, { loc: true })
      if (ast.type !== 'Program') {
        return
      }
      if (ast.body.length === 0) {
        return
      }
      ast.body.filter(body => isAssignTagProperty(body) || isAssignProperty(body)).forEach(body => {
        warn('Keep tag options primitive.', event, body);
      })
    });
  }
}