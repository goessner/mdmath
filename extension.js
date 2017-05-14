/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Stefan Goessner - 2016-17. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const vscode = require('vscode');
const path = require('path');
(process.env["LC_CTYPE"] = process.env.LC_CTYPE || "UTF-8");
const cp = require('clipboardy');
const hl = require('highlight.js');
const kt = require('katex');
const md = require('markdown-it')({ html: true,
                                    linkify: true,
                                    highlight: function(str,lang) {
                                        if (lang && hl.getLanguage(lang)) {
                                            try { return '<pre class="hljs"><code><div>' + hl.highlight(lang, str, true).value + '</div></code></pre>'; }
                                            catch(error) {}
                                        }
                                        return '<pre class="hljs"><code><div>' + md.utils.escapeHtml(str) + '</div></code></pre>';
                                    }
                                  });

// this method is called when extension is activated ..
exports.activate = function activate(context) {
    let provider = MathProvider.create(context),
        reg1 = vscode.workspace.registerTextDocumentContentProvider('mdmath', provider),
        reg2 = vscode.commands.registerCommand('mdmath.showPreview', MathProvider.showPreviewCmd),
        reg3 = vscode.commands.registerCommand('mdmath.exportToHtml', MathProvider.exportHtmlCmd),
        reg4 = vscode.commands.registerCommand('mdmath.clipToHtml', MathProvider.clipHtmlCmd),
        cfg = (key) => vscode.workspace.getConfiguration('mdmath')[key];

	vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'markdown'
         && event.document.uri.scheme !== 'markdown'   // prevent processing of own documents
         && event.document.isDirty) {
            const uri = vscode.Uri.parse('mdmath://extension/mdmath');
			provider.update(uri);
		}
    });

    context.subscriptions.push(reg1, reg2, reg3, reg4);

    // load additional extensions upon configuration ...
    if (cfg('footnotes')) {
        md.use(require('markdown-it-footnote'));
        console.log("'markdown-it-footnote' enabled.");
    }
    if (cfg('toc')['enabled']) {
        md.use(require('markdown-it-anchor'), {
            level: cfg('toc')['permalinkLevel'],
            permalink: cfg('toc')['permalink'],
            permalinkBefore: true,
            permalinkSymbol: cfg('toc')['permalinkSymbol']
        });
        md.use(require('markdown-it-table-of-contents'), {
            includeLevel: cfg('toc')['includeLevel']
        });
        console.log("'markdown-it-table-of-contents' enabled.");
    }

    console.log("'mdmath' activated !")
}

// this method is called when extension is deactivated ..
exports.deactivate = function deactivate() {};

// Markdown+Math provider class ..
const MathProvider = {
    // statics ...
    create: function() { var o = Object.create(this.prototype); o.constructor.apply(o,arguments); return o; },
    rules: [
        { rex:/\\\$/g, tmpl: "\xB6" }, // substitute '\$' by '¶' temporarily ...
        { rex:/(\r?\n|^|>)\s*?\${2}([^$]*?)\${2}\s*?\(([^)$\r\n]*?)\)(?=$|\r?\n|\s)/g, tmpl: ($0,$1,$2,$3) => `${$1}<section class="eqno"><eqn>${MathProvider.math($2,true)}</eqn><span>(${$3})</span></section>\n` }, // display equation $$...$$ equation number
        { rex:/(\r?\n|^|>)\s*?\${2}([^$]*?)\${2}(?=$|\r?\n|\s)/g, tmpl: ($0,$1,$2) => `${$1}<section><eqn>${MathProvider.math($2,true)}</eqn></section>\n` }, // display equation $$...$$
        { rex:/(\D|\$|^)\$(\S[^$\r\n]*?\S)\$(?!\d)/g, tmpl: ($0,$1,$2) => `${$1}<eq>${MathProvider.math($2,false)}</eq>` },  // multi-character inline equation $...$
        { rex:/(\D|^)\$([^$\r\n\t ]{1})\$(?!\d)/g, tmpl: ($0,$1,$2) => `${$1}<eq>${MathProvider.math($2,false)}</eq>` },  // single-character inline equation $...$
        { rex:/\xB6/g, tmpl: "$" } // reverse temporary substitution ...
    ],
    math: function(tex,disp) {
        let res;
        try {
            // don't forget to escape '_','*', and '\' .. after math rendering
            res = kt.renderToString(tex,{throwOnError:false,displayMode:disp}).replace(/([_\*\\])/g, "\\$1");
        }
        catch(err) {
            res = err;
        }
        return res;
    },
    viewUri: vscode.Uri.parse('mdmath://extension/mdmath'),    
    get activeDocument() {
        let doc = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document || MathProvider._activeDocument || false;
        if (!doc) vscode.window.showInformationMessage('Cannot locate current text document!');
        return doc;
    },
    get fname() { return MathProvider.activeDocument.uri.fsPath; },
    get document() {
        let markdown = MathProvider.activeDocument.getText();   // get raw markdown code ...

        // extract front-matter (json style {{{...}}} or yaml style ---...---) from markdown content.
        if (MathProvider.hideFrontMatter) {
            markdown = markdown.replace(/^\s*?[{-]{3}([\s\S]+?)[}-]{3}\s*?/, '');
        }
        for (let rule of MathProvider.rules) { // apply rules ...
            markdown = markdown.replace(rule.rex, rule.tmpl);
        }
        return md.render(markdown);
    },
    get styleSheet() { return vscode.workspace.getConfiguration('mdmath')['style'] },
    // implement 'hideFrontMatter' as a lazy getter for better performance.
    // ... (see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/get)
    get hideFrontMatter() {
        delete this.hideFrontMatter;
        return this.hideFrontMatter = vscode.workspace.getConfiguration('markdown')['previewFrontMatter'] === 'hide';
    },

    // see https://github.com/Microsoft/vscode/blob/master/extensions/markdown/src/extension.ts@getViewColumn
    targetPreviewColumn(sideBySide) {
        const vuecol = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : false;
        
        return !vuecol                          ? vscode.ViewColumn.One
             : !sideBySide                      ? vuecol
             : vuecol === vscode.ViewColumn.One ? vscode.ViewColumn.Two
             : vuecol === vscode.ViewColumn.Two ? vscode.ViewColumn.Three
             : vuecol;
    },
    // proto ...
    prototype: {
        constructor: function(context) {
            this.context = context;
            this.emitter = new vscode.EventEmitter();
            this.basePath = context.asAbsolutePath('.');
        },
        get onDidChange() { return this.emitter.event; },
        // debounce/throttle update events ...
        // see https://github.com/Microsoft/vscode/blob/master/extensions/markdown/src/previewContentProvider.ts
        update: function(uri) { 
            if (!this._waiting) {
                this._waiting = true;
                setTimeout(() => {
                    this._waiting = false;
                    this.emitter.fire(uri);
                }, 400);
            }           
        },
        provideTextDocumentContent: function(uri,token) {
            if (!token || !token.isCancellationRequested) {
                // save current document for accessing it from preview window later ...
                MathProvider._activeDocument = vscode.window.activeTextEditor.document;
                return `<!doctype html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="file://${this.basePath}/css/markdown.css">
<link rel="stylesheet" href="file://${this.basePath}/css/tomorrow.css">
<link rel="stylesheet" href="file://${this.basePath}/css/katex.min.css">
<link rel="stylesheet" href="file://${this.basePath}/css/mdmath.css">
${MathProvider.styleSheet ? `<link rel="stylesheet" href="file://${this.basePath}/${MathProvider.styleSheet}">`:''}
<base href="${MathProvider.activeDocument.uri.toString(true)}">
</head><body>
${MathProvider.document}
</body></html>`;
            }
        }
    },

    showPreviewCmd: function() {
        vscode.commands.executeCommand('vscode.previewHtml', 
                                        MathProvider.viewUri, 
                                        vscode.ViewColumn.Two, 
                                        "Preview: "+path.basename(MathProvider.fname))
                       .then(success => {}, error => {console.error(error)});
    },
    clipHtmlCmd: function() {
        let html = `<!doctype html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.4.1/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/default.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/goessner/mdmath/master/css/mdmath.css">
</head><body class="markdown-body">
${MathProvider.document}
</body></html>`;
        cp.write(html).then(()=>vscode.window.showInformationMessage('Html copied to clipboard!'));
    },
    exportHtmlCmd: function() {    // 
        if (vscode.window.activeTextEditor) {
           let channel = vscode.window.createOutputChannel('\''+path.basename(MathProvider.fname)+'\' as html'),
               html = `<!doctype html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.4.1/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/default.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/goessner/mdmath/master/css/mdmath.css">
</head><body class="markdown-body">
${MathProvider.document}
</body></html>`;

            channel.show(false);  // don't take focus ..
            channel.append(html);
            vscode.window.showInformationMessage('Command "Markdown+Math as HTML" deprecated. Copy Html to clipboard via command "Clip Markdown+Math to HTML" instead !');
        }
        else
            vscode.window.showInformationMessage('Cannot show source of that document. Make source window active!');
    }
};
