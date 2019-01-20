/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Stefan Goessner - 2016-19. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const vscode = require('vscode'),
      htmlTmpl = (html,usrcss) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.10.0/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js">
<link  rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.css" integrity="sha384-9eLZqc9ds8eNjO3TmqPeYcDj8n+Qfa4nuSiGYa6DjLNcv9BtN69ZIulL9+8CqC9Y" crossorigin="anonymous">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/goessner/mdmath/master/css/texmath.css">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/goessner/mdmath/master/css/vscode-texmath.css">
${usrcss ? `<link rel="stylesheet" href="${usrcss}">` : ''}
</head><body class="markdown-body">
${html}
</body></html>`.replace('vscode-resource:','');

// this method is called when extension is activated ..
exports.activate = function activate(context) {
    let   mdit = null,
          cb = null,
          mkdirp = null,
          watchingFs = false;

    const kt = require('katex'),
          tm = require('markdown-it-texmath').use(kt),
          path = require('path'),
          fs = require('fs'),
          cfg = (key) => vscode.workspace.getConfiguration('mdmath')[key],
          delimiters = cfg('delimiters') || 'dollars',
          macros = JSON.parse(JSON.stringify(cfg('macros'))),  // wondering why this JSON stuff is necessary
          options = Object.keys(macros).length !== 0 ? {delimiters,macros} : {delimiters},
          runIf = (cond, f) => {
                return () => {
                    cond() && f() 
                }
          },
          infoMsg = (msg) => {
                vscode.window.showInformationMessage(`Markdown + Math: ${msg}`);
          },
          errMsg = (msg) => {
                vscode.window.showErrorMessage(`Markdown + Math: ${msg}`);
          },
          makeHTML = () => {
                const doc = vscode.window.activeTextEditor
                         && vscode.window.activeTextEditor.document;
                if (!doc || doc.languageId !== 'markdown')
                    return infoMsg('Active document is no markdown source document!');
                if (!mdit)
                    return infoMsg('Corresponding markdown preview document needs to be opened at least once!');
                    
                return htmlTmpl(mdit.render(doc.getText()))
          },
          outputLocationOf = (fsPath) => {
                const root = vscode.workspace.getWorkspaceFolder(fsPath) || vscode.workspace.rootPath,
                      parsed = path.parse(fsPath),
                      savePath = cfg('savePath')
                                    .replace('${file.name}', parsed.name)
                                    .replace('${file.ext}', parsed.ext),
                      out = savePath.startsWith('/') ? path.resolve(root, `.${savePath}`) : path.resolve(parsed.dir, savePath);

                return path.isAbsolute(out) ? out : path.resolve(parsed.dir, `./${parsed.name}.html`);
          },
          clip = () => {
                if (!cb) cb = require('clipboardy');
                cb.write(makeHTML())
                  .then(()=>infoMsg('Html copied to clipboard!'),
                        (err)=>errMsg('Html copying to clipboard failed: ' + err.message));
          },
          save = (uri) => {
                try {
                    uri = uri || vscode.window.activeTextEditor.document.uri;
                    if (!watchingFs)  // lazy activate fileSystemWatcher ... !
                       watchingFs = watch(vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(path.dirname(uri.fsPath), '**/*.md')));

                    const dest = outputLocationOf(uri.fsPath);

                    if (!mkdirp) mkdirp = require('mkdirp').sync;

                    mkdirp(path.parse(dest).dir);

                    fs.writeFileSync(dest, makeHTML(), 'UTF-8');
                    infoMsg(`Html saved to ${dest}!`);
                } catch (err) {
                    errMsg('Saving html failed: ' + err.message);
                }
          },
          watch = (watcher) => {
                const autosave = runIf(() => { return cfg('autosave') }, save);
                watcher.onDidChange(autosave); 
                watcher.onDidCreate(autosave);
                watcher.onDidDelete((uri) => {
                    try {
                        const dest = outputLocationOf(uri.fsPath);
                        fs.unlinkSync(dest);
                        infoMsg(`Removed ${dest}.`);
                    } catch (err) {
                        errMsg('Removing file failed: ' + err.message);
                    }
                });
                return true;
          };

    context.subscriptions.push(vscode.commands.registerCommand('extension.clipToHtml', clip));
    context.subscriptions.push(vscode.commands.registerCommand('extension.saveToHtml', save));

    return {
        extendMarkdownIt: function(md) {
            return (mdit = md).use(tm, options);
        }
    }
}
// this method is called when extension is deactivated ..
exports.deactivate = function deactivate() {};
