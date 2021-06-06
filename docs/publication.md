---
"lang": "en",
"title": "Web Publications &mdash; LaTeX Style",
"subtitle": "Give your Web Publications <span>L<q>a</q>T<q>e</q>X</span> Style",
"authors": ["Stefan Gössner<sup>1</sup>"],
"adresses": ["<sup>1</sup>Dortmund University of Applied Sciences. Department of Mechanical Engineering"],
"date": "May 2021",
"description": "mdmath &ndash; how to use LaTex theme with markdown",
"tags": ["mdmath","static page","publication","Journal","LaTeX","math"]
---
### Abstract
Now there is an easy way to have both, a possibly interactive, static web page containing math and a scientific print document for documentation and publication,
each looking like a professional LaTeX document. All you need is the popular free, open source [*Visual Studio Code* text editor](https://code.visualstudio.com/) with its lightweight extension [*Markdown+Math*](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath) for managing LaTeX style and math syntax as well as using meanwhile ubiquitous Markdown language. The resulting *HTML* document already contains prerendered math formulas, so browsers won't have the burden of math rendering via scripting.

## Content
  - [1. Introduction](#1-introduction)
  - [2. Editor, Math Extension and Configuration](#2-editor-math-extension-and-configuration)
  - [3. Markdown Overview](#3-markdown-overview)
    - [3.1 Headings](#31-headings)
    - [3.2 Paragraph](#32-paragraph)
    - [3.3 Images](#33-images)
    - [3.4 Blockquote](#34-blockquote)
    - [3.5 Code Blocks](#35-code-blocks)
    - [3.6 Inline Markdown](#36-inline-markdown)
    - [3.7 Table](#37-table)
    - [3.8 Wrapping Text around figures, listings, etc.](#38-wrapping-text-around-figures-listings-etc)
    - [3.9 Math Support](#39-math-support)
  - [4. Document Structure](#4-document-structure)
  - [5. Styling](#5-styling)
  - [6. Conclusion](#6-conclusion)
  - [References](#references)

<br><br><br><br><br><br>

## 1. Introduction


There has been an upward trend in using Markdown language not only for web content, but also for student notes, handouts and scientific papers of small to medium size. Markdown source files are benefitial for viewing, editing and archiving content. Additionally we can generate visually pleasing LaTeX style documents from it

* as HTML pages possibly containing interactive graphics.
* as static PDF print documents.

Markdown parsers usually export semantic HTML, i.e. meaningful HTML elements only without using `class` attributes. Styling those HTML documents is accomplished then by using *classless* CSS stylesheets [[4,5](#4)]. Styling semantic HTML with classless CSS ...

* makes HTML and CSS easy to read and understand.
* results in overall small code size.
* installs no rigid class name dependencies between HTML and CSS.

Edward Tufte's conventions for styling papers and handouts are followed here as a guidline [[6](#6)].

This paper &ndash; styled itself as a LaTeX document &ndash; first lists the necessary installation aspects in short. After a tiny example of a LaTeX styled markdown document, it gives a quick overview of Markdown for newcomers. Finally some useful features proposed for scientific publication are explained in more detail.

Source code of the HTML template and its accompanying class-less CSS file can be found on GitHub [[7](#7)].

## 2. Editor, Math Extension and Configuration

If you are a programmer, chances are high, that you already have installed and use [*Visual Studio Code*](https://code.visualstudio.com/). Otherwise you can install it from [here](https://code.visualstudio.com/) and easily use it as a general non-wysiwyg text editor with excellent Markdown support.

Getting scientific now we install the VSCode extension [markdown+math](https://marketplace.visualstudio.com/items?itemName=goessner.mdmath). You can do it [directly from within VSCode](https://code.visualstudio.com/docs/editor/extension-marketplace) via 
```
View > Extensions
```
Now in VSCode select the menu entry
```
File > Preferences > Settings
```
and switch to the *mdmath* extension Theme `'publication'`.

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

Now from the VSCode Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) run the command `Markdown: Save Markdown+Math to HTML` or simply press (<kbd>Ctrl</kbd>+<kbd>K</kbd> <kbd>,</kbd>).

That way we have created an HTML version of our markdown file `euler.md` named `euler.html`, both located in the same folder. Viewing it in the browser of your choice gives:

<figure> 
   <img src="./img/euler-identity-browser.png">
</figure>  
<figcaption>Fig 3: HTML Output &ndash; Euler's Identity </figcaption><br>

Having this we can generate a print document `euler.pdf` quite easily using our browser's *print to PDF* functionality. You can [download a version from here]() for inspection.

## 3. Markdown Overview

According to the CommonMark specification [[2](#2)], basic Markdown translates into a limited set of semantic HTML elements. 

```html
<a>, <blockquote>, <code>, <em>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <hr>, <img>, <li>, <ol>, <p>, <pre>, <strong>, <ul>
```
It may be noticeable that not very semantic HTML elements `<div>` and `<span>` are missing here. For supporting these list of elements, a small CSS file suffices. Please also take note that Markdown allows to embed plain HTML code when needed.

### 3.1 Headings

Edward Tufte's conventions followed here recommend to use `<h1>` for the document title only, `<h2>` for section headings, and `<h3>` for lower level headings [[6](#6)]. So for document structuring only two heading levels `'##'` (`<h2>`) and `'###'` (`<h3>`) are totally sufficient &ndash; with reference to famous *Feynman* lectures on physics [[11](#11)].

```md
# Reserved for Document Title `<h1>`
## Primary Section Headings `<h2>`
### Secondary Lower Level Headings `<h3>`
#### Not Recommended for Use `<h4> - <h6>`
```

### 3.2 Paragraph

Markdown interpretes a sequence of text lines, separated from others by a blank line, as a paragraph and translates it into an HTML `<p>` element. 
In the same way you can't control text wrap with HTML, you cannot do that with Markdown.

But you might &ndash; as an exception to that rule &ndash; force a *hard line break* by using HTML `<br>` or append at least two trailing spaces at the end of a line.

### 3.3 Images

Markdown images are inline elements with the syntax `![alt text](/path/to/img "title")`. These images are displayed side by side.

If we want to center-align an image and give it a caption, we use the semantic HTML `<figure>` and `<figcaption>` elements instead.
```
<figure>
  <img src="./img/triangle.png">
  <figcaption>Fig 1: The right triangle</figcaption>
</figure>
```

<figure> 
   <img src="./img/triangle.png">
   <figcaption>Fig 4: Right triangle</figcaption>
</figure>  

Images are responsive regarding their size, which we can verify by changing the size of the browser window.

### 3.4 Blockquote

Markdown uses email-style `>` characters for blockquoting.

```md
> A human being is part of a whole called by us <q>Universe</q>.  
> &mdash; Albert Einstein, *A Man of Many Parts*
```
> A human being is part of a whole called by us <q>Universe</q>.  
> &mdash; Albert Einstein, *A Man of Many Parts*.

In scientific documents *Theorems*, *Lemmas* and *Proofs* are frequently written using blockquote syntax in Markdown.

### 3.5 Code Blocks

We can insert preformatted text in code blocks enclosed by three backticks `` ``` `` on its own single line each. Immediatelly following the begin-backticks we may specify the language for syntax highlighting. 

````
```js
function print({x=0,y=0}) {
    return `(${x},${y}`;
};
```
<figcaption>Listing 1: JavaScript function</figcaption>
````
`<figcaption>` heading might be comfortably used as a code block caption.
``` js
function print({x=0,y=0}) {
    return `(${x},${y}`;
};
console.log(print({x:3,y:4}));
```
<figcaption>Listing 1: JavaScript function</figcaption>

### 3.6 Inline Markdown

Besides regular Markdown inline rules there are some beneficial HTML inline elements.

<figcaption> Table 2: Some Inline Markdown / Markup </figcaption>

| Markdown / Markup | Result |
|:--|:--|
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
|`<q>... quotation ...</q>` | <q>... quotation ...</q> |
|`<cite>... citation ...</cite>` | <cite>... citation ...</cite> |

<br><br>

### 3.7 Table

```
<figcaption> Table 3: Column alignment </figcaption>

| Left | Center | Right |
|:---|:---:|--:|
|L|C|R| 
```
We can use a simple syntax for tables, which is a popular extension to the CommonMark standard [[3](#3)]. Inline rules as shown in Table 2 apply to the table cells. Tables as a whole are always center-aligned.

<figcaption> Table 3: Column alignment </figcaption>

| Left | Center | Right |
|:---|:---:|--:|
|L|C|R| 


### 3.8 Wrapping Text around figures, listings, etc.

<aside>

   ![aside image](./img/triangle.png "triangle aside")
   <figcaption> Fig. 6: Triangle aside</figcaption>

</aside>

This is not a Markdown feature. Also text wrapping is controversial discussed regarding its use in scientific papers. 
But if you want that, HTML `<aside>` comes for help.
HTML specification recommends to <q>use `<aside>` only for content that is indirectly related to the main article content.</q>

> Note the general fact, that we can use Markdown text inside of HTML block elements, as long as it starts and ends with a blank line.

```html
<aside>

   ![aside image](./img/triangle.png "triangle aside")
   <figcaption> Fig. 6: Triangle aside</figcaption>

</aside>
```

### 3.9 Math Support

Math support is the core functionality of *mdmath*. Inline math $r = \sqrt{x^2 + y^2}$ and display math expressions $$e^{ix}=\cos x + i\sin x$$ are supported, due to `markdown-it` extension `markdown-it-texmath` [[8](#8)] and the fast math renderer KaTeX [[9](#9)]. Commutative diagrams can be used  since *mdmath* version 2.6

$$\begin{CD} A @>a>> B \\ @VbVV @AAcA \\ C @= D \end{CD}$$

```markdown
... Inline math $r = \sqrt{x^2 + y^2}$ and display math expressions $$e^{ix}=\cos x + i\sin x$$ are supported ... Commutative diagrams can be used since *mdmath* version 2.6

$$\begin{CD} A @>a>> B \\ @VbVV @AAcA \\ C @= D \end{CD}$$
```

## 4. Document Structure

The visual part of exported HTML document is provided by *mdmath* template `themes/publication/theme.js`, which has a simple semantic structure:
```html
<body>
  <header> ... </header>
  <main> ... </main>
</body>
```
Your Markdown content will be parsed by `markdown-it`, the Markdown parser used by VSCode [[10](#10)]. Resulting HTML output goes then into the `<main>` section.

Markdown does not assist you to structure your textual content any further. Especially it does not use HTML `<article>` and `<section>` elements. But in fact it doesn't need to, as *headings* &ndash; the remaining structuring elements &ndash; are totally sufficient.

The `<header>` section contains the paper's title, authors, author addresses, date and keywords. These data are to be found in a *Frontmatter* metadata section at the beginning of the Markdown file and will also be processed via the template file. The *Frontmatter* section inside `euler.md` example has following structure

```json
---
"lang": "en",
"title": "Euler's Identity",
"subtitle": "How to combine 5 important math constants to a short formula",
"authors": ["Max Muster<sup>1</sup>", "Lisa Master<sup>2</sup>"],
"adresses": ["<sup>1</sup>Hochschule Gartenstadt","<sup>2</sup>Universität Übersee"],
"date": "May 2021",
"description": "mdmath LaTeX demo site",
"tags": ["markdown+math","VSCode","static page","publication","LaTeX","math"]
---
```

> Note that Frontmatter syntax used here must strictly obey `JSON` syntax. So it is more restrictive than `YAML` based Frontmatter syntaxes.

*mdmath* offers a very basic but useful *Table Of Content* command. While editing Markdown ... 

1. Invoke comand `Insert Table of Content` from Command Palette or press <kbd>Ctrl</kbd>+<kbd>K</kbd> <kbd>T</kbd>.
2. Manually remove unwanted ToC entries.
3. Done.

## 5. Styling

In order to approach LaTeX look and feel by Markdown authoring, a pure classless CSS stylesheet is needed. You might want to have a look into [*mdmath*'s stylesheet](https://github.com/goessner/mdmath/blob/master/themes/publication/style.css).

There are some LaTeX stylesheets on the web.

* *Huy Nguyen*'s `latex-simple-css`, [GitHub](https://github.com/huyng/latex-simple-css), [stylesheet](https://github.com/huyng/latex-simple-css/blob/master/custom.css), [Example](https://everyhue.me/latex-simple-css/)  
   - Classless CSS, HTML example file is heavily class-dependent. 
   - No math. 
   - No Latex fonts.
* *Andrew Belt*'s `WiTex`, [GitHub](https://github.com/AndrewBelt/WiTeX), [stylesheet](https://github.com/AndrewBelt/WiTeX/blob/master/style.css), [Example](https://github.com/AndrewBelt/WiTeX/blob/master/screenshot.png)   
   - LaTeX CSS file copied and modified from Wikipedia, not classless.
   - Math rendering via MathJax scripting.
   - `'Latin Modern Roman'` font files.
* *David Zollikofer*'s `latexcss`, [GitHub](https://github.com/davidrzs/latexcss), [stylesheet](https://github.com/davidrzs/latexcss/blob/master/latex.css), [Example](https://davidrzs.github.io/latexcss/)
   - Classless CSS + classes for theorem, lemma, proof, ...
   - Math rendering via MathJax scripting.
   - Data-url embedded `'Latin Modern Roman'` fonts.
* *Vincent Dörig*'s `latex-css`, [GitHub](https://github.com/vincentdoerig/latex-css), [stylesheet](https://github.com/vincentdoerig/latex-css/blob/master/style.css), [Example](https://latex.now.sh/)
   - Classless CSS + classes for theorem, lemma, proof, ...
   - Math rendering via MathJax scripting.
   - `'Latin Modern Roman'` font files.

All of these stylesheets seem to address handmade HTML exclusively. HTML as Markdown export is not mentioned.

Vincent Dörig's approach looks very promising.  Acknowledgment goes to him for providing the *Latin Modern Roman* typeface font reused with *mdmath*. 

## 6. Conclusion

HTML output provided by the theme <q>publication</q> of *mdmath* offers a styling with LaTeX look and feel. With it student notes, handouts and scientific papers can be comfortably authored using the Markdown language, while previewing the result in texteditor VSCode. During the Markdown &#8594; HTML conversion process math formulas are converted to browser understandable markup. So no script based math renderer is finally needed on the browser side. In fact no script at all is used within resulting HTML output. 

*mdmath* addresses small to medium sized documents. However for large work as theses and books, available powerful LaTeX packages or &ndash; if you want to stick with Markdown &ndash; 
[Pandoc](https://pandoc.org/) is highly recommended.


### References
<span id='1'>[1] Daring Fireball (https://daringfireball.net/projects/markdown/)  
<span id='2'>[2] CommonMark (https://commonmark.org/)   
<span id='3'>[3] CommonMark - Deployed Extensions,   (https://tinyurl.com/5bm568tn)   
<span id='4'>[4] No-Class CSS Frameworks, (https://css-tricks.com/no-class-css-frameworks/)  
<span id='5'>[5] The Next CSS Frontier — Classless, (https://tinyurl.com/vynsw3ew)  
<span id='6'>[6] Tufte-CSS, (https://edwardtufte.github.io/tufte-css/)  
<span id="7">[7]</span> Markdown+Math (https://github.com/goessner/mdmath)    
<span id="8">[8]</span> markdown-it-texmath, (https://github.com/goessner/markdown-it-texmath).  
<span id='9'>[9] KaTeX, (https://katex.org/)  
<span id='10'>[10] markdown-it, (https://github.com/markdown-it/markdown-it)  
<span id='11'>[11] The Feyman Lectures on Physics, (https://www.feynmanlectures.caltech.edu/)  

