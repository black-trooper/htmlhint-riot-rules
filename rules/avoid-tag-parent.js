const id = 'avoid-tag-parent';

module.exports = {
  id,
  description: 'Avoid tag.parent.',
  init: function (parser, reporter) {
    var self = this;
    var regex = /\{.*parent.*?\}/;
    parser.addListener('tagstart', function (event) {
      var attrs = event.attrs,
        attr,
        col = event.col + event.tagName.length + 1;
      for (var i = 0, l = attrs.length; i < l; i++) {
        attr = attrs[i];

        if (regex.test(attr.value) === true) {
          if (attrs.some(attr => attr.name === 'each') && /\{.*parent.parent.*?\}/.test(attr.value) === false) {
            return
          }
          reporter.warn('The attribute [ ' + attr.name + ' ] must avoid tag.parent.', event.line, col + attr.index, self, attr.raw);
        }
      }
    });
    parser.addListener('text', function (event) {
      if (regex.test(event.raw) === true) {
        reporter.warn('Must avoid tag.parent.', event.line, event.col, self, event.raw);
      }
    });
  }
}