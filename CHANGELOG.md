## CHANGELOG

###  [1.2.7]() on May 14, 2017
* Height increase in `mdmath.css` with block equations and formula numbers removed.
* Chinese language bug with `mdmath.clipToHtml` removed ([issue](https://github.com/goessner/mdmath/issues/13#ref-commit-0e32c99)).
* KaTeX version upgrade to 0.7.1.
* `highlight.js` version upgrade to 9.11.0.

###  [1.2.6]() on March 01, 2017
* Bug in `mdmath.css` removed.

###  [1.2.5]() on March 01, 2017
* `mdmath.css` modified in order to align KaTeX font-size with surrounding text.

###  [1.2.4]() on February 24, 2017
* *debounce/throttle* update events to prevent misbehaving scrolling of preview window with large math documents.

###  [1.2.0]() on February 20, 2017
* *blockquote* bug removed.
* Support of user settings.
* Allow *yaml* and *JSON* front matter in markdown.
* Copy HTML source to clipboard.
* Command `Markdown+Math to Html` is now deprecated.
* Generation of *Table of Contents* is now supported.
* Support of custom CSS styles for preview window.
* Documentation changes
  * moved CHANGELOG to its own file
  * moved CONTRIBUTING guide
  * added ISSUE_TEMPLATE
  * updated links in README
* Updated CSS links for generated HTML code.
* Updated dependencies and added bugs section to `package.json`.

### [1.1.0](https://github.com/goessner/mdmath/compare/5329d04...fcfcbdf) on December 27, 2016

* Single character inline formula bug fixed.
* Formula in lists bug fixed.
* Handling of KaTeX errors improved.
* Micro-improvement of regular expressions.

### [1.0.1](https://github.com/goessner/mdmath/compare/d7b2f55...5329d04) on December 21, 2016

* `code block` bug removed.

### [1.0.0](https://github.com/goessner/mdmath/compare/f0eaf9b...d7b2f55) on December 20, 2016

* Dependency on `markdown-it-katex` removed in favour of some lightweight regular expressions.
* Very simple (manual) equation numbering implemented.
* KaTeX error highlighting activated.
* Footnotes by `markdown-it-footnote` added.
* Standalone [tests](http://goessner.github.io/mdmath/test/) for math rendering added.
* Markdown+Math CSS file added to [CDN](https://gitcdn.xyz/repo/goessner/mdmath/master/css/mdmath.css)
* Some minor bugs removed.

### [0.9.0](https://github.com/goessner/mdmath/compare/20e9002...f0eaf9b) on December 3, 2016

* Installation bug resolved

### [0.8.0](https://github.com/goessner/mdmath/tree/20e9002) on November 25, 2016

* First Release
