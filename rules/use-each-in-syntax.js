const id = 'use-each-in-syntax';

module.exports = {
  id,
  description: 'Use each ... in syntax.',
  init: function (parser, reporter) {
    var self = this;
    var regex = /\{.*[ \t]in[ \t].*?\}/;
    parser.addListener('tagstart', function (event) {
      var attrs = event.attrs,
        attr,
        col = event.col + event.tagName.length + 1;
      for (var i = 0, l = attrs.length; i < l; i++) {
        attr = attrs[i];

        if (attr.name.toLowerCase() === 'each' && regex.test(attr.value) === false) {
          reporter.warn('The attribute [ ' + attr.name + ' ] must use each ... in syntax.', event.line, col + attr.index, self, attr.raw);
        }
      }
    });
  }
}