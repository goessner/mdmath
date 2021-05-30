---
"lang": "en",
"title": "mdmath - <span>L<q>a</q>T<q>e</q>X</span> Style",
"subtitle": "Give your Web Publications <span>L<q>a</q>T<q>e</q>X</span> Style",
"authors": ["Stefan Gössner<sup>1</sup>"],
"adresses": ["<sup>1</sup>Dortmund University of Applied Sciences. Department of Mechanical Engineering"],
"date": "May 2021",
"description": "mdmath &ndash; how to use LaTex theme with markdown",
"tags": ["mdmath","static page","publication","Journal","LaTeX","math"]
---
### Abstract
Now there is an easy way to have both, a possibly interactive, static web page containing math and a scientific print document for documentation and publication,
each looking like a professional LaTeX document. All you need is the popular free, open source [*Visual Studio Code* text editor](https://code.visualstudio.com/) with its lightweight extension [*Markdown+Math*](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) for managing LaTeX style and math syntax as well as using meanwhile ubiquitous Markdown language. The resulting *HTML* document already containes prerendered math formulas, so browsers won't have the burden of math rendering via scripting.

## Content

## 1. Introduction

There has been an upward trend in using Markdown language not only for web content, but also for student notes, handouts and scientific papers of small to medium size.

* Markdown source for viewing, editing and archiving.
* Generating visually pleasing HTML pages possibly containing interactive graphics.
* Generating static print documents as PDF files.

Motivation behind the idea of having a webpage looking like a LaTeX document is to style web articles in the same way as research papers or handouts. Intention is to generate both

* a graphical interactive static web page.
* a print document for documentation and publication.

from a single Markdown source document [[1](#1)]. 

Students increasingly use 

Markdown parsers usually export semantic HTML, i.e. meaningful HTML elements only, while avoiding artificial `<div class="context">` tags [[1-3](#1)]. Styling those &ndash; from Markdown originated &ndash; HTML documents is accomplished then by using *classless* CSS stylesheets [[4,5](#4)]. Styling semantic HTML with classless CSS ...

* makes HTML and CSS easy to read and understand.
* results in overall small code size.
* installs no rigid class name dependencies between HTML and CSS.

This paper &ndash; styled itself as a LaTeX document &ndash; first lists the necessary installation aspects in short. After a tiny example of a LaTeX styled markdown document, it gives a short overview of Markdown for newcomers. Finally some useful features proposed for scientific publication are explained in more detail.

Source code of the HTML template and its accompanying class-less CSS file can be found on GitHub [[6](#6)].

## Editor, Math Extension and Configuration

If you are a programmer, chances are high, that you already have installed and use [*Visual Studio Code*](https://code.visualstudio.com/). Otherwise you can install it from [here](https://code.visualstudio.com/) and easily use it as a general non-wysiwyg text editor with excellent markdown support.

Getting scientific now we install the VSCode extension [markdown+math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath). You can do it [directly from within VSCode](https://code.visualstudio.com/docs/editor/extension-marketplace). 

Now in VSCode we select the menu entry
```
File > Preferences > Settings
```
and choose the *mdmath* extension theme `'publication'`.

<figure> 
   <img src="./img/publication-settings.png">
</figure>  
<figcaption>Fig 1: Setting theme for LaTeX output.</figcaption><br>

Now for verifying, that everything works as expected ...

* Open a new file in VSCode and save it as `euler.md`.
* Navigate your browser to the example file [`https://raw.githubusercontent.com/goessner/mdmath/master/docs/euler.md`](https://raw.githubusercontent.com/goessner/mdmath/master/docs/euler.md) and copy / paste the markdown text into your open VSCode document.
* Open a preview window to the side (<kbd>Ctrl</kbd>+<kbd>K</kbd> <kbd>V</kbd>).

You should see something similar to the following yet:

<figure> 
   <img src="./img/euler-identity.png">
</figure>  
<figcaption>Fig 2: Markdown Example &ndash; Euler's Identity </figcaption><br>

Now from the VSCode Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) run the command `Markdown: Save Markdown+Math to HTML` or more simply press (<kbd>Ctrl</kbd>+<kbd>K</kbd> <kbd>,</kbd>).

That way we have created an HTML version of our markdown file `euler.md` named `euler.html`, both located in the same folder. Viewing it in the browser of your choice gives:

<figure> 
   <img src="./img/euler-identity-browser.png">
</figure>  
<figcaption>Fig 3: HTML Output &ndash; Euler's Identity </figcaption><br>

Given this we can generate a print document `euler.pdf` quite easily using our browser's *print to PDF* function. You can [download the document from here]() for inspection.

## Markdown to HTML

According to the CommonMark specification [[2](#2)], basic Markdown translates into a limited set of semantic HTML elements. 

```html
<a>, <blockquote>, <code>, <em>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <hr>, <img>, <li>, <ol>, <p>, <pre>, <strong>, <ul>
```

For supporting these elements only, we would merely need a small CSS file. But we might recall, that Markdown allows to embed plain HTML code. 
So we can use HTML inline elements besides regular Markdown inline rules.

#### **Table 1**: Some Inline Markdown / Markup

| Markdown / Markup | Result |
|--|--|
|`A [link to the top](#top)`|  A [link to the top](#top)|
|`*italic text*`  |*italic text*  |
|`**strong text**`  |**strong text**  |
|`***strong italic text***`  |***strong italic text*** |
|`~~strike through~~`  |~~strike through~~  |
|`<!--stripped comment-->`  |<!--stripped comment-->  |
|`<u>underlining</u>`  |<u>underlining</u>  |
|`Super<sup>script</sup>`  |Super<sup>script</sup>  |
|`Sub<sub>script</sub>`  |Sub<sub>script</sub>  |
|`<small>Small text for fine print</small>`   |<small>Small text for fine print</small>   |
|`<kbd>Alt</kbd>+<kbd>Ctrl</kbd> <kbd>Del</kbd>`   |<kbd>Alt</kbd>+<kbd>Ctrl</kbd> <kbd>Del</kbd>  |
|`<abbr title="Cascading Style Sheets">CSS</abbr>`  |<abbr title="Cascading Style Sheets">CSS</abbr>  |
|`Hilite text with <mark>mark</mark>` | Hilite text with <mark>mark</mark> |
|`Hard line<br>break` * | Hard line<br>break |
|`<q>... If not now, when?</q> &ndash; JFK` | <q>... If not now, when?</q> &ndash; JFK |
|`<span>L<q>a</q>T<q>e</q>X</span>` ** | <span>L<q>a</q>T<q>e</q>X</span>|
#### * Beneath the `<br>` element we can also use two trailing spaces at the end of line.<br>** Topology and styling of this logo is discussed below.

## Document Structure

The visual part of this document has a simple semantic structure:
```html
<body>
  <header> ... </header>
  <main> ... </main>
</body>
```
The `<header>` section contains the paper's title, authors, author addresses, date and keywords. These data are to be found in a *frontmatter* metadata section at the beginning of the Markdown file. Those metadata will be processed via an HTML template file.

Your Markdown content goes into the `<main>` section and will then be parsed by [`markdown-it`](https://markdown-it.github.io/markdown-it/).
Markdown does not assist you to structure your textual content any further. Especially it does not offer equivalent HTML `<article>` and `<section>` elements. But in fact it doesn't need to, as *headings* &ndash; the remaining structuring elements &ndash; are totally sufficient.

### Heading

The style used here only supports 4 different headings for logical sectioning content.

```md
# `<h1>` ... reserved for paper title
## `<h2>` ... primary section headings 
### `<h3>` ... lower level headings
#### `<h4>` ... special `heading` for tables, images, aside sections, source listings
```
We want to adapt the conventions from [Tufte-CSS](https://edwardtufte.github.io/tufte-css/), where only two heading levels `<h2>` and `<h3>` are supported with reference to famous *Feynman* lectures on physics [[8](#8)].

### Paragraph

Markdown interpretes a sequence of text lines, separated from others by a blank line, as a paragraph and translates it into an HTML `<p>` element. 
In the same way you can't control text wrap with HTML, you cannot do that with Markdown. 
But as already mentioned, you can &ndash; as an exception to that rule &ndash; force a *hard line break* by using `<br>` or appending at least two trailing spaces at the end of the line.

### Blockquote

Markdown uses email-style `>` characters for blockquoting.

```md
> A human being is part of a whole called by us <q>Universe<q>.  
> -- *Albert Einstein*
```
> A human being is part of a whole called by us <q>Universe</q>.  
> -- *Albert Einstein*


In scientific documents *Theorems*, *Lemmas* and *Proofs* are frequently written using blockquote syntax in Markdown.

### Table

We can use a simple syntax for tables, which is a popular extension to the CommonMark standard [[9](#9)].
```
#### Table 2:  Syntax
| Left | Center | Right |
|:---|:---:|--:|
|L|C|R| 
```
Inline rules as shown in Table 1 apply to the table cells.

#### Table 2: Syntax
| Left | Center | Right |
|:---|:---:|--:|
|L|C|R| 

Tables as a whole are always center-aligned. Note, how `<h4>` heading is used as the table heading / caption. Also note, how the second line defines the cell content alignment.

### Code Blocks

We can insert preformatted text in code blocks enclosed by three backticks `` ``` `` on its own single line each. 
````md 
```
M a t r i x
 [ 1 0 0 ]
 [ 0 1 0 ]
 [ 0 0 1 ]
```
````
Immediatelly following the begin-backticks we may specify the language for syntax highlighting. 

````
```js
function print({x=0,y=0}) {
    return `(${x},${y}`;
};
console.log(print({x:3,y:4}));
```
#### Code Listing
````
The `<h4>` heading again can be comfortably used as a code block caption.
``` js
function print({x=0,y=0}) {
    return `(${x},${y}`;
};
console.log(print({x:3,y:4}));
```
#### Code Listing

### Sidebar

<aside>
   <img src="./img/triangle.png">
</aside>

The term "sidebar" describes "a portion of a document whose content is only indirectly related to the document's main content". It comes from its frequently seen presentation as a visually separated box placed at the page's side.

"Sidebar" is not a Markdown element. But we can make elegantly and via the semantic HTML `<aside>` element.

```html
<aside>
   <img src="./img/triangle.png">
</aside>
```

> We are allowed to use
> * headings &amp; paragraphs
> * lists &amp; tables
> * blockquotes &amp; code blocks &amp; images
> 
> with sidebars.


## Images

Images are inline elements with the syntax `![alt text](/path/to/img "title")`.
```
![logo](./img/md.32x20-solid.png "logo") 
![logo dimensions](./img/markdown-mark-spec.png "logo dimensions") 
```
So these images are displayed side by side.

![logo](./img/md.32x20-solid.png "logo") 
![logo dimensions](./img/markdown-mark-spec.png "logo dimensions")

If we want to center-align an image and give it a caption, we might want to use the semantic HTML `<figure>` element instead.
```
<figure>
  <img src="./img/triangle.png">
</figure>
```
<figure> 
   <img src="./img/euler-identity.png">
</figure>  
<figcaption>Fig 1: Euler's Identity</figcaption>

The figure caption can be placed below via our meanwhile universal `<h4>` (read: '*heading for*' :) or in this case via the even more semantic HTML `<figcaption>` element.

Images are responsive, which we can verify by changing the size of the browser window.

## Math

*Inline* and *display math* expressions are supported. The excerpt of a publication then might look like this [[11](#11)]:

```md
The symplectic ... there is

$$\bold J \frac{\partial\bold a}{\partial x} = \frac{\partial\bold a}{\partial y}\quad and \quad \bold J \frac{\partial\bold a}{\partial y} = -\frac{\partial\bold a}{\partial x}\,.$$

Complex structure ... (see $\bold J^2 = -\bold I$) ... the expression

$$c\,\bold a + d\,\tilde\bold a = \begin{pmatrix}c x - d y \\ c y + d x\end{pmatrix}\,,$$ (3.8)
```

The symplectic vector space is equipped with a complex structure $\bold J$ according to (2.6).
This also holds in general for tangent vectors, so for vector $\bold a = (x, y)^T$ there is

$$\bold J \frac{\partial\bold a}{\partial x} = \frac{\partial\bold a}{\partial y}\quad and \quad \bold J \frac{\partial\bold a}{\partial y} = -\frac{\partial\bold a}{\partial x}\,.$$

Complex structure $\bold J$ plays the role of the imaginary unit $i$ (see $\bold J^2 = -\bold I$) performing a counterclockwise rotation by $\pi/2\,$. We can write down the expression

$$c\,\bold a + d\,\tilde{\bold a} = \begin{pmatrix}c x - d y \\ c y + d x\end{pmatrix}\,,$$ (3.8)

Math rendering takes place in parallel with the Markdown parsing process by the parser plugin `markdown-it-texmath` [[10](#10)] in combination with the fast Math renderer KaTeX [[12](#12)]. Benefit is here, that the resulting HTML document has the prerendered math formulas already included. So there is no need to load and use scripts for browser side math rendering.

## Styling

Upto here we were mainly talking about content elements and structure. Styling &ndash; and with that LaTeX look and feel &ndash; wasn't mentioned significantly so far, apart from some positioning aspects.

### Available LaTeX Stylesheets

In order to approach that LaTeX look and feel by Markdown authoring, we need a pure classless CSS stylesheet. Asking my search engine for '`latex css`' gives &ndash; after filtering &ndash; four relevant hits:

* *Huy Nguyen*'s **latex-simple-css**, [GitHub](https://github.com/huyng/latex-simple-css), [stylesheet](https://github.com/huyng/latex-simple-css/blob/master/custom.css), [Example](https://everyhue.me/latex-simple-css/)  
   - Classless CSS, HTML example file is heavily class-dependent. 
   - No math. 
   - No Latex fonts.
* *Andrew Belt*'s **WiTex**, [GitHub](https://github.com/AndrewBelt/WiTeX), [stylesheet](https://github.com/AndrewBelt/WiTeX/blob/master/style.css), [Example](https://github.com/AndrewBelt/WiTeX/blob/master/screenshot.png)   
   - LaTeX CSS file copied and modified from Wikipedia, not classless.
   - Math rendering via MathJax scripting.
   - `'Latin Modern Roman'` font files.
* *David Zollikofer*'s **latexcss**, [GitHub](https://github.com/davidrzs/latexcss), [stylesheet](https://github.com/davidrzs/latexcss/blob/master/latex.css), [Example](https://davidrzs.github.io/latexcss/)
   - Classless CSS + classes for theorem, lemma, proof, ...
   - Math rendering via MathJax scripting.
   - Data-url embedded `'Latin Modern Roman'` fonts.
* *Vincent Dörig*'s **latex-css**, [GitHub](https://github.com/vincentdoerig/latex-css), [stylesheet](https://github.com/vincentdoerig/latex-css/blob/master/style.css), [Example](https://latex.now.sh/)
   - Classless CSS + classes for theorem, lemma, proof, ...
   - Math rendering via MathJax scripting.
   - `'Latin Modern Roman'` font files.

All of these four stylesheets seem to address handmade HTML exclusively. HTML as Markdown export is not mentioned.

* The first CSS file from *Huy Nguyen* looks completely classless. Unfortunately its associated HTML example file is heavily class-dependent. No math is enabled. No special font files were used. 

* Andrew Belt &ndash; the second &ndash; has copied and modified a LaTeX CSS file from Wikipedia, which is far away from being classless. He offers a set of good looking `'Latin Modern Roman'` fonts in his repository. He does math rendering via Mathjax scripting.

* Vincent Dörig &ndash; the last &ndash; has recently published a very promising LaTeX CSS file. 

## Conclusion


## References

<span id='1'>[1]  [Daring Fireball](https://daringfireball.net/projects/markdown/)   
<span id='2'>[2] [CommonMark](https://commonmark.org/)  
<span id='3'>[3] [CommonMark - Deployed Extensions](https://github.com/commonmark/commonmark-spec/wiki/Deployed-Extensions)  
<span id='4'>[4] [No-Class CSS Frameworks ](https://css-tricks.com/no-class-css-frameworks/)  
<span id='5'>[5] [The Next CSS Frontier — Classless](https://blog.usejournal.com/the-next-css-frontier-classless-5e66f3f25fdd)  
<span id="6">[6]</span> [margdown+math](https://github.com/goessner/mdmath).  
<span id="7">[7]</span> [markdown-it-texmath](https://github.com/goessner/markdown-it-texmath).  
<span id='8'>[8] [The Feyman Lectures on Physics](https://www.feynmanlectures.caltech.edu/)  
<span id="12">[11]</span> [Symplectic Geometry for Engineers - Fundamentals](https://www.researchgate.net/publication/338124384_Symplectic_Geometry_for_Engineers_-_Fundamentals) .


