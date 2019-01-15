const id = 'script-inside-tag';

module.exports = {
  id,
  description: 'Use <script> inside tag.',
  init: function (parser, reporter) {
    var self = this;
    var rootTag = '';
    var hasScript = false;
    var TRIM_TRAIL = /[ \t]+$/gm
    var END_TAGS = /\/>\n|^<(?:\/?-?[A-Za-z][-\w\xA0-\xFF]*\s*|-?[A-Za-z][-\w\xA0-\xFF]*\s+[-\w:\xA0-\xFF][\S\s]*?)>\n/
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
            var blocks = splitBlocks(lastEvent.raw.replace(TRIM_TRAIL, ''))
            if (isJS(blocks[1])) {
              reporter.error('Use <script> inside tag.', event.line, event.col, self, event.raw);
            }
          }
        }
        parser.removeListener('tagstart', onTagStart);
        parser.removeListener('tagend', onTagEnd);
      }
    }
    function splitBlocks(str) {
      if (/<[-\w]/.test(str)) {
        var
          m,
          k = str.lastIndexOf('<'),
          n = str.length

        while (k !== -1) {
          m = str.slice(k, n).match(END_TAGS)
          if (m) {
            k += m.index + m[0].length
            m = str.slice(0, k)
            if (m.slice(-5) === '<-/>\n') m = m.slice(0, -5) // riot/riot#1966
            return [m, str.slice(k)]
          }
          n = k
          k = str.lastIndexOf('<', k - 1)
        }
      }
      return ['', str]
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