const marked = require('./marked.js');
const hljs = require('highlight.js');
const assign = require('object-assign');

module.exports = function(markdown, opts) {
  marked.setOptions(assign({}, {
    gfm: true,
    renderer: new marked.Renderer(),
    headerPrefix: 'headings-',
    sanitize: false,
    footnotes: true,
    allheadings:[],
    breaks: true,
    emoji: true,
    highlight: function (code, lang) {
      return lang && hljs.getLanguage(lang)
        ? hljs.highlight(lang, code).value
        : hljs.highlightAuto(code).value;
    },
  }, opts));
  return marked(markdown)
};
