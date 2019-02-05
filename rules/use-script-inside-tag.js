const id = 'use-script-inside-tag';

module.exports = {
  id,
  description: 'Use <script> inside tag.',
  init: function (parser, reporter) {
    var self = this;
    var rootTag = '';
    var hasScript = false;
    var TRIM_TRAIL = /[ \t]+$/gm
    var S_SQ_STR = /'[^'\n\r\\]*(?:\\(?:\r\n?|[\S\s])[^'\n\r\\]*)*'/.source
    var S_R_SRC1 = [
      /\/\*[^*]*\*+(?:[^*/][^*]*\*+)*\//.source,   // multiline comments
      '//.*',                                 // single-line comments
      S_SQ_STR,                               // single-quoted string
      S_SQ_STR.replace(/'/g, '"'),            // double-quoted string
      '([/`])'                                // start of regex or ES6TL or ${}
    ].join('|')

    function onTagStart(event) {
      var tagName = event.tagName.toLowerCase();
      if (rootTag === '') {
        rootTag = tagName;
      }
      if (tagName === 'script') {
        hasScript = true;
        parser.removeListener('tagstart', onTagStart);
        parser.removeListener('tagend', onTagEnd);
      }
    }
    function onTagEnd(event) {
      var tagName = event.tagName.toLowerCase();
      if (tagName === rootTag) {
        if (hasScript === false) {
          var lastEvent = event.lastEvent;
          if (lastEvent.type !== 'tagstart') {
            if (isJS(lastEvent.raw.replace(TRIM_TRAIL, ''))) {
              reporter.error('Use <script> inside tag.', event.line, event.col, self, event.raw);
            }
          }
        }
        parser.removeListener('tagstart', onTagStart);
        parser.removeListener('tagend', onTagEnd);
      }
    }
    function isJS(js) {
      if (!/\S/.test(js)) return false
      var re = new RegExp(S_R_SRC1, 'g')
      return re.test(js)
    }

    parser.addListener('tagstart', onTagStart);
    parser.addListener('tagend', onTagEnd);
  }
}