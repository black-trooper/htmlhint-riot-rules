const id = 'tag-options-primitive';
const esprima = require('esprima');
const reserved = require('reserved-words')

module.exports = {
  id,
  description: 'Keep tag options primitive.',
  init: function (parser, reporter) {
    var self = this;
    // RegExp Lookbehind Assertions. requires Node.js 9.11.2 or later
    const regex = /(?<!\\){.*?[^\\]}/g;
    function isNotPrimitiveOption(body) {
      let flg = false
      JSON.parse(JSON.stringify(body), (key, value) => {
        if (key == 'object'
          && value.type && value.type == 'MemberExpression'
          && value.object
          && value.object.type && value.object.type == 'Identifier'
          && value.object.name && value.object.name == 'opts'
        ) {
          flg = true
        }
        return value;
      });
      return flg
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

        const expressions = attr.value.match(regex)
        if (!expressions) {
          continue
        }
        const flg = expressions.some(expression => {
          let code = expression.replace('\{', '').replace('\}', '')
          if (code.indexOf('opts.') < 0) {
            return false
          }
          // escape reserved word
          Object.keys(reserved.KEYWORDS['3']).forEach(key => {
            code = code.replace(new RegExp(key, 'g'), `_${key}`)
          })
          if (attr.name == 'each') {
            code = code.replace(/_in/g, "in")
          }

          const ast = esprima.parseModule(code)
          return isNotPrimitiveOption(ast.body)
        })
        if (flg) {
          reporter.warn('The attribute [ ' + attr.name + ' ] keep tag options primitive.', event.line, col + attr.index, self, attr.raw);
        }
      }
    });
    parser.addListener('text', function (event) {
      const expressions = event.raw.match(regex)
      if (!expressions) {
        return
      }
      const flg = expressions.some(expression => {
        let code = expression.replace('\{', '').replace('\}', '')
        if (code.indexOf('opts.') < 0) {
          return false
        }
        // escape reserved word
        Object.keys(reserved.KEYWORDS['3']).forEach(key => {
          code = code.replace(new RegExp(key, 'g'), `_${key}`)
        })
        const ast = esprima.parseModule(code)
        return isNotPrimitiveOption(ast.body)
      })
      if (flg) {
        reporter.warn('Keep tag options primitive.', event.line, event.col, self, event.raw);
      }
    });
    parser.addListener('cdata', function (event) {
      if (event.tagName.toLowerCase() !== 'script') {
        return
      }
      const code = event.raw.replace(/\t/g, ' ');
      if (code.indexOf('opts.') < 0) {
        return
      }
      const ast = esprima.parseModule(code, { loc: true })
      if (ast.type !== 'Program') {
        return
      }
      if (ast.body.length === 0) {
        return
      }

      ast.body.filter(body => isNotPrimitiveOption(body)).forEach(body => {
        warn('Keep tag options primitive.', event, body);
      })
    });
  }
}