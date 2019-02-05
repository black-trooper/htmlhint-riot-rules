const id = 'tag-name-include-hyphen';

module.exports = {
  id,
  description: 'Custom element spec compliant. (include a hyphen, don\'t use reserved names.) \'app\'- namespaced',
  init: function (parser, reporter, options) {
    const self = this;
    const regex = /-/;
    let rootTag = '';

    function onTagStart(event) {
      var tagName = event.tagName.toLowerCase();
      if (rootTag === '') {
        rootTag = tagName;
        if (!regex.test(rootTag)) {
          reporter.error('Not custom element spec compliant. Include a hyphen.  \'app\'- namespaced.', event.line, event.col, self, event.raw);
        }

      }
    }
    function onTagEnd(event) {
      var tagName = event.tagName.toLowerCase();
      if (tagName === rootTag) {
        parser.removeListener('tagstart', onTagStart);
        parser.removeListener('tagend', onTagEnd);
      }
    }

    parser.addListener('tagstart', onTagStart);
    parser.addListener('tagend', onTagEnd);
  }
}