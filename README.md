# ![mdmath](img/icon.png) Markdown+Math

[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/goessner/mdmath/license.txt)
[![npm](https://img.shields.io/npm/v/mdmath.svg)](https://www.npmjs.com/package/mdmath)
[![npm](https://img.shields.io/npm/dt/mdmath.svg)](https://www.npmjs.com/package/mdmath)

## What is it ...

**mdmath** allows to use *Visual Studio Code* as a markdown editor capable of typesetting and rendering TeX math.
In fact it functions and renders identically to the built in markdown viewer. Additionally KaTeX works inside as a fast math renderer.

You can install the extension directly from [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath).

Release 1.0 published with support of ...

* Formula numbers.
* Footnotes

![mdmath editing](img/edit.gif)

## Features
Simplify the process of authoring and live previewing markdown documents containing math formulas.
This extension is a comfortable tool for scientists, engineers and students with markdown as their first choice 
document format.

* Inline math by `$ ... $`
* Display math by `$$ ... $$`
* Add formula numbering by `$$ ... $$ (1)`
* Inline math with tables
* Embedded HTML
* Syntax highlighting with code sections
* Export resulting HTML code for web usage

## Test Table

Some math expressions are collected in a [test table](http://goessner.github.io/mdmath/test/).

## Installation ...

### ... from inside of VSCode

Press <kbd>F1</kbd> key inside of *Visual Studio Code* and type `extension`. Choose `Extensions: Install Extension` 
and then select the `Markdown+Math` extension from the list.

### ... from Mac & Linux Command Line
```
cd $HOME/.vscode/extensions
git clone https://github.com/goessner/mdmath.git
cd mdmath
npm install
```

### ... from Windows Command Line
```
cd  %USERPROFILE%\.vscode\extensions
git clone https://github.com/goessner/mdmath.git
cd mdmath
npm install
```

## Usage

* Launch *VS Code*, create or open a markdown file (`.md`).
* Press <kbd>Ctrl+Shift+.</kbd> to open a preview window side by side, or ...
* .. alternatively press <kbd>Ctrl+Shift+P</kbd> and run the command `Markdown+Math` to achive the same.
* Typeset in your markdown source window and see the preview window live updating.
* Press <kbd>Ctrl+Shift+P</kbd> and run the command `Markdown+Math as HTML` to open an output window for 
  viewing and possibly copying the corresponding HTML source.

![mdmath html export](img/htmlExport.png)

>*Note*: Attempt to show HTML output with *Preview Window* as *Active Window* results in a warning `Cannot show source of that document!`. Make your markdown source window *active* first.

You can see HTML export of `triangle.md` live in [your browser](http://goessner.github.io/mdmath/triangle.html).


## Dependencies

* [markdown-it](https://github.com/markdown-it/markdown-it). The markdown renderer also used in VS Code.
* [katex](https://github.com/Khan/KaTeX). This is where credits for fast rendering TeX math in HTML go to.
* [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote). Using footnotes in markdown.
* [highlight.js](https://github.com/isagalaev/highlight.js). The code highlighter also used in VS Code.

## Issues, Hints

* In order to create `*.pdf` output from your Markdown you should consider using [Pandoc](http://pandoc.org/).
* Opening multiple preview windows is not possible at current. Even changing the active markdown source window 
  doesn't update the preview window properly. Close the preview window first as a workaround here.

## Contributing

See [contributing.md](contributing.md)

## ChangeLog

* December 21, 2016
  * Release 1.0.1
  * `code block` bug removed.

* December 20, 2016
  * Release 1.0.0
  * Dependency on `markdown-it-katex` removed in favour of some lightweight regular expressions.
  * Very simple (manual) equation numbering implemented.
  * KaTeX error highlighting activated.
  * Footnotes by `markdown-it-footnote` added.
  * Standalone [tests](http://goessner.github.io/mdmath/test/) for math rendering added.
  * Markdown+Math CSS file added to [CDN](https://gitcdn.xyz/repo/goessner/mdmath/master/css/mdmath.css)
  * Some minor bugs removed.

* December 2, 2016
  * Release 0.9.0
  * Installation bug resolved

* November 25, 2016
  * First Release 0.8.0


## License

*Markdown+Math* for VS Code is licensed under the [MIT License](http://opensource.org/licenses/MIT)

 © [Stefan Gössner](https://github.com/goessner)
