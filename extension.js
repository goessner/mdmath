/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Stefan Goessner - 2016-19. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const vscode = require('vscode');

// this method is called when extension is activated ..
exports.activate = function activate(context) {
    let   mdit = null;   // markdown-it object ...

    const kt = require('katex'),
          tm = require('markdown-it-texmath').use(kt),
          path = require('path'),
          fs = require('fs'),
          cfg = (key) => vscode.workspace.getConfiguration('mdmath')[key],
          infoMsg = (msg) => {
                vscode.window.showInformationMessage(`Markdown + Math: ${msg}`);
          },
          errMsg = (msg) => {
                vscode.window.showErrorMessage(`Markdown + Math: ${msg}`);
          },
          asHTML = () => {
                const doc = vscode.window.activeTextEditor
                         && vscode.window.activeTextEditor.document,
                      usrcss = cfg('style');

                if (!doc || doc.languageId !== 'markdown')
                    return infoMsg('Active document is no markdown source document!');
                if (!mdit)
                    return infoMsg('Corresponding markdown preview document needs to be opened at least once!');
                    
                return htmlTmpl(mdit.render(doc.getText()), usrcss.length ? usrcss : false);
          },
          clip = () => {
              vscode.env.clipboard.writeText(asHTML())
                    .then(()=>infoMsg('Html copied to clipboard!'),
                          (err)=>errMsg('Html copying to clipboard failed: ' + err.message));
          },
          save = (uri) => {
                try {
                    const fs = require('fs');
                    uri = uri || vscode.window.activeTextEditor.document.uri;
                    fs.writeFileSync(outputLocationOf(uri.fsPath), asHTML(), 'utf8');
                    infoMsg(`Html saved to ${outputLocationOf(uri.fsPath)} !`);
                } catch (err) {
                    errMsg('Saving html failed: ' + err.message);
                }
          },
          outputLocationOf = (fsPath) => {
                const root = vscode.workspace.getWorkspaceFolder(fsPath),
                      parsed = path.parse(fsPath),
                      savePath = cfg('savePath')  // use https://code.visualstudio.com/updates/v1_31#_global-storage-path instead in future !
                                    .replace('${file.name}', parsed.name)
                                    .replace('${file.ext}', parsed.ext),
                      out = savePath.startsWith('/') ? path.resolve(root, `.${savePath}`) : path.resolve(parsed.dir, savePath);

                return path.isAbsolute(out) ? out : path.resolve(parsed.dir, `./${parsed.name}.html`);
          },
          loadMacros = () => {
                try {
                    const macroDef = JSON.stringify(cfg('macros')),
                          macroUrl = cfg('macroFile'),
                          macros = macroUrl.length ? fs.readFileSync(path.resolve(macroUrl),'utf8')
                                                   : macroDef;

                    return JSON.parse(macros);
                } catch (err) {
                    errMsg('Loading macros failed: ' + err.message);
                }
          },
          delimiters = JSON.parse(JSON.stringify(cfg('delimiters'))) || 'dollars', // wondering why this ...
          macros = loadMacros(),  // ... JSON stuff is necessary ...
          options = Object.keys(macros).length !== 0 ? {delimiters,macros} : {delimiters};


    context.subscriptions.push(vscode.commands.registerCommand('extension.clipToHtml', clip));
    context.subscriptions.push(vscode.commands.registerCommand('extension.saveToHtml', save));

    if (cfg('autosave')) {  // Initialize autosave functionality ... if user defined !
        let watching = false;
        const initWatching = () => {
            if (!watching && vscode.window.activeTextEditor) {
                const pattern = new vscode.RelativePattern(path.dirname(vscode.window.activeTextEditor.document.uri.fsPath), '**/*.md'),
                      watcher = vscode.workspace.createFileSystemWatcher(pattern,false,false,true);
                watcher.onDidChange(save); 
                watcher.onDidCreate(save);
                watching = true;
            }
        };
        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(initWatching));
    }

    return {
        extendMarkdownIt: function(md) {
            return (mdit = md).use(tm, options);
        }
    }
}
// this method is called when extension is deactivated ..
exports.deactivate = function deactivate() {};

const htmlTmpl = (html,usrcss) => `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@9.18.1/lib/index.min.js">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/markdown-it-texmath@0.6.5/css/texmath.css">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/goessner/mdmath/master/css/vscode-texmath.css">
${usrcss ? `<link rel="stylesheet" href="${usrcss}">` : ''}
</head>
<body class="markdown-body">
${html}
</body></html>`.replace(/<img src="vscode-resource:/g,'<img src="');

