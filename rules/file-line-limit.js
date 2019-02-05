const id = 'file-line-limit';

module.exports = {
  id,
  description: 'Always construct your app out of small modules which do one thing and do it well.',
  init: function (parser, reporter, options) {
    const self = this;
    let rootTag = '';
    let limit = options > 1 ? options : 100

    function onTagStart(event) {
      var tagName = event.tagName.toLowerCase();
      if (rootTag === '') {
        rootTag = tagName;
      }
    }
    function onTagEnd(event) {
      var tagName = event.tagName.toLowerCase();
      if (tagName === rootTag) {
        if (limit < event.line) {
          reporter.warn('File lines limit.', event.line, event.col, self, event.raw);
        }
        parser.removeListener('tagstart', onTagStart);
        parser.removeListener('tagend', onTagEnd);
      }
    }

    parser.addListener('tagstart', onTagStart);
    parser.addListener('tagend', onTagEnd);
  }
}