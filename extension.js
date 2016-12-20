/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Stefan Goessner. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const vscode = require('vscode');
const path = require('path');

const hl = require('highlight.js');
const kt = require('katex');
const mf = require('markdown-it-footnote');
const md = require('markdown-it')({ html: true,
                                    linkify: true,
                                    highlight: function(str,lang) {
                                        if (lang && hl.getLanguage(lang)) {
                                            try { return '<pre class="hljs"><code><div>' + hl.highlight(lang, str, true).value + '</div></code></pre>'; }
                                            catch(error) {}
                                        }
                                        return '<pre class="hljs"><code><div>' + md.utils.escapeHtml(str) + '</div></code></pre>';
                                    }
                                  }).use(mf);
                                    

// this method is called when extension is activated ..
exports.activate = function activate(context) {
    let provider = MathProvider.create(context),
        reg1 = vscode.workspace.registerTextDocumentContentProvider('mdmath', provider),
        reg2 = vscode.commands.registerCommand('mdmath.showPreview', MathProvider.showPreviewCmd),
        reg3 = vscode.commands.registerCommand('mdmath.exportToHtml', MathProvider.exportHtmlCmd);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (event.document.languageId === 'markdown'
         && event.document.uri.scheme !== 'markdown'   // prevent processing of own documents
         && event.document.isDirty) {
            const uri = vscode.Uri.parse('mdmath://extension/mdmath');
			provider.update(uri);
		}
    });

    context.subscriptions.push(reg1, reg2, reg3);

    console.log("mdmath activated !")
}

// this method is called when extension is deactivated ..
exports.deactivate = function deactivate() {};

// Markdown+Math provider class ..
const MathProvider = {
    create: function() { var o = Object.create(this.prototype); o.constructor.apply(o,arguments); return o; },
    rules: [
        { rex:/\\\$/g, tmpl: "\xB6" }, // substitute '\$' by '¶' temporarily ...
        { rex:/(?:^|\r?\n)\s*?\${2}([^$]*?)\${2}\s*?\(([^)$\r\n]*?)\)(?=$|\r?\n|\s)/g, tmpl: ($0,$1,$2) => `<section class="eqno"><span>(${$2})</span><eqn>${MathProvider.math($1,true)}</eqn></section>` }, // display equation $$...$$
        { rex:/(?:^|\r?\n)\s*?\${2}([^$]*?)\${2}/g, tmpl: ($0,$1) => `<eqn>${MathProvider.math($1,true)}</eqn>` }, // display equation $$...$$
        { rex:/(^|\D|\$)\$(\S[^$\r\n]*?\S)\$(?!\d)/g, tmpl: ($0,$1,$2) => `${$1}<eq>${MathProvider.math($2,false)}</eq>` }, // multi-character inline equation $...$
        { rex:/(^|\D)\$([^$\r\n\t ]{1})\$(?!\d)/g, tmpl: ($0,$1,$2) => `${$1}<eq>${MathProvider.math($2,false)}</eq>` },  // single-character inline equation $...$
        { rex:/\xB6/g, tmpl: "$" } // reverse temporary substitution ...
    ],
    math: function(tex,disp) {
        // don't forget to escape '_' and '\' ..
        return kt.renderToString(tex,{throwOnError:false,displayMode:disp}).replace(/([_*\\])/g, "\\$1");
    },
    viewUri: vscode.Uri.parse('mdmath://extension/mdmath'),
    get fname() { return vscode.window.activeTextEditor.document.uri.fsPath; },
//    get fname() { return vscode.window.activeTextEditor.document.fileName; },
    get document() {
        let markdown = vscode.window.activeTextEditor.document.getText();   // get raw markdown code ...

        for (let rule of MathProvider.rules) { // apply rules ...
            markdown = markdown.replace(rule.rex, rule.tmpl);
        }
        return md.render(markdown);
    },
    prototype: {
        constructor: function(context) {
            this.context = context;
            this.emitter = new vscode.EventEmitter();
            this.basePath = context.asAbsolutePath('.');
            this.package = require(context.asAbsolutePath('./package.json'));
        },
        get onDidChange() { return this.emitter.event; },
        update: function(uri) { this.emitter.fire(uri); },
        provideTextDocumentContent: function(uri) {
            return  `<!DOCTYPE html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="file://${this.basePath}/css/markdown.css">
<link rel="stylesheet" href="file://${this.basePath}/css/tomorrow.css">
<link rel="stylesheet" href="file://${this.basePath}/css/katex.min.css">
<link rel="stylesheet" href="file://${this.basePath}/css/mdmath.css">
<base href=${vscode.window.activeTextEditor.document.uri.toString(true)}">
</head><body>${MathProvider.document}</body></html>`;
        }
    },

    showPreviewCmd: function() {
        vscode.commands.executeCommand('vscode.previewHtml', 
                                        MathProvider.viewUri, 
                                        vscode.ViewColumn.Two, 
                                        "Preview: "+path.basename(MathProvider.fname))
                        .then(success => {}, error => {console.error(error)});
    },
    exportHtmlCmd: function() {
        if (vscode.window.activeTextEditor) {
            let channel = vscode.window.createOutputChannel('\''+path.basename(MathProvider.fname)+'\' as html'),
                html = `<!DOCTYPE html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.4.1/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
</head><body>
${MathProvider.document}
</body></html>`;

            channel.show(false);  // don't take focus ..
            channel.append(html);
        }
        else
            vscode.window.showInformationMessage('Cannot show source of that document !');
    }
};
