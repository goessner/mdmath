/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Stefan Goessner - 2016-17. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const vscode = require('vscode'),
      clipTmpl = (html,usrcss) => `<!doctype html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.4.1/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/default.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.2/katex.min.css">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/goessner/mdmath/master/css/mdmath.css">
${usrcss ? `<link rel="stylesheet" href="${usrcss}">` : ''}
</head><body class="markdown-body">
${html}
</body></html>`;

// this method is called when extension is activated ..
exports.activate = function activate(context) {
    const kt = require('katex'),
          tm = require('markdown-it-texmath').use(kt),
          cfg = (key) => vscode.workspace.getConfiguration('mdmath')[key],
          delimiters = cfg('delimiters') || 'dollars',
          clip = () => {
               const doc = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
               if (!doc || doc.languageId !== 'markdown')
                   return vscode.window.showInformationMessage('Active document is no markdown source document!');
               if (!mdit)
                   return vscode.window.showInformationMessage('Corresponding markdown preview document needs to be opened at least once!');
               if (!cb) cb = require('clipboardy');
               cb.write(clipTmpl(mdit.render(doc.getText())))
                 .then(()=>vscode.window.showInformationMessage('Html copied to clipboard!'));
          };
    let   mdit = null,
          cb = null;

    context.subscriptions.push(vscode.commands.registerCommand('extension.clipToHtml', clip));
    return {
        extendMarkdownIt: function(md) {
            return (mdit = md).use(tm, {delimiters:delimiters});
        }
    }
}
// this method is called when extension is deactivated ..
exports.deactivate = function deactivate() {};
