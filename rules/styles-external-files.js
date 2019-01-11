const id = 'styles-external-files';

module.exports = {
  id,
  description: 'Put styles in external files.',
  init: function (parser, reporter) {
    var self = this;
    parser.addListener('tagstart', function (event) {
      if (event.tagName.toLowerCase() === 'style') {
        reporter.warn('Put styles in external files.', event.line, event.col, self, event.raw);
      }
    });
  }
}