/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Stefan Goessner - 2016-17. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

const vscode = require('vscode'),
      clipTmpl = (html,usrcss) => `<!doctype html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.4.1/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/default.min.css">
<link  rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.0-rc.1/dist/katex.min.css" integrity="sha384-D+9gmBxUQogRLqvARvNLmA9hS2x//eK1FhVb9PiU86gmcrBrJAQT8okdJ4LMp2uv" crossorigin="anonymous">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/goessner/mdmath/master/css/texmath.css">
<link rel="stylesheet" href="https://gitcdn.xyz/repo/goessner/mdmath/master/css/vscode-texmath.css">
${usrcss ? `<link rel="stylesheet" href="${usrcss}">` : ''}
</head><body class="markdown-body">
${html}
</body></html>`.replace('vscode-resource:','');

// this method is called when extension is activated ..
exports.activate = function activate(context) {
    const kt = require('katex'),
          tm = require('markdown-it-texmath').use(kt),
          path = require('path'),
          fs = require('fs'),
          mkdirp = require('mkdirp').sync,
          cfg = (key) => vscode.workspace.getConfiguration('mdmath')[key],
          delimiters = cfg('delimiters') || 'dollars',
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
                   const doc = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
                   if (!doc || doc.languageId !== 'markdown')
                       return infoMsg('Active document is no markdown source document!');
                   if (!mdit)
                       return infoMsg('Corresponding markdown preview document needs to be opened at least once!');
                    
                   return clipTmpl(mdit.render(doc.getText()))
               
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
                    uri = uri || vscode.window.activeTextEditor._documentData._uri;
                    const dest = outputLocationOf(uri.fsPath);
                    

                    mkdirp(path.parse(dest).dir);

                    fs.writeFileSync(dest, makeHTML(), 'UTF-8');
                    infoMsg(`Html saved to ${dest}!`);
               } catch (err) {
                    errMsg('Saving html failed: ' + err.message);
               }
                      
          };
    let   mdit = null,
          cb = null;

    
    ((watcher) => {
        const autosave = runIf(() => { return cfg('autosave') }, save);
        watcher.onDidChange(autosave); watcher.onDidCreate(autosave);
        watcher.onDidDelete((uri) => {
            try {
                const dest = outputLocationOf(uri.fsPath);
                fs.unlinkSync(dest);
                infoMsg(`Removed ${dest}.`);
            } catch (err) {
                errMsg('Removing file failed: ' + err.message);
            }
        });

    })(vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.workspace.rootPath, '**/*.md')));
    
    context.subscriptions.push(vscode.commands.registerCommand('extension.clipToHtml', clip));
    context.subscriptions.push(vscode.commands.registerCommand('extension.renderToHtml', save));
    return {
        extendMarkdownIt: function(md) {
            return (mdit = md).use(tm, {delimiters:delimiters});
        }
    }
}
// this method is called when extension is deactivated ..
exports.deactivate = function deactivate() {};
