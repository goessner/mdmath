const vscode = require('vscode');
const path = require('path');

const hl = require('highlight.js');
const mk = require('markdown-it-katex');
const md = require('markdown-it')({ html: true,
                                    linkify: true,
                                    highlight: function(str,lang) {
                                        if (lang && hl.getLanguage(lang)) {
                                            try { return '<pre class="hljs"><code><div>' + hl.highlight(lang, str, true).value + '</div></code></pre>'; }
                                            catch(error) {}
                                        }
                                        return '<pre class="hljs"><code><div>' + md.utils.escapeHtml(str) + '</div></code></pre>';
                                    }
                                  }).use(mk);

// static object ..
const provider = {
    viewUri: vscode.Uri.parse('mdmath://extension/mdmath'),
    emitter: new vscode.EventEmitter(),
    basePath: "",   // fill that ..
    package: null,  // .. inside of 'activate'

    get fname() { return vscode.window.activeTextEditor.document.fileName; },
    get onDidChange() { return provider.emitter.event; },
    get asHtml() {
        let markdown = md.render(vscode.window.activeTextEditor.document.getText());
        return  `<!DOCTYPE html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="file://${this.basePath}/css/markdown.css">
<link rel="stylesheet" href="file://${this.basePath}/css/tomorrow.css">
<link rel="stylesheet" href="file://${this.basePath}/css/katex.min.css">
<base href=${vscode.window.activeTextEditor.document.uri.toString(true)}">
</head><body>${markdown}</body></html>`;
    },
    onDidChangeTextDocument: function(e) {
        if (e.document.isDirty) {
           this.update(this.viewUri);
        }
    },
    onDidChangeActiveTextEditor: function(e) {
        // don't know what to do here in order to change the preview .. ?
    },
    provideTextDocumentContent: function(uri) { return provider.asHtml; },

    update: function(uri) { this.emitter.fire(uri); },

    previewCmd: function() {
        vscode.commands.executeCommand('vscode.previewHtml', provider.viewUri, vscode.ViewColumn.Two, 
                                       "Preview: "+path.basename(provider.fname))
                       .then(success => {}, error => {console.error(error)});
    },
    saveAsHtmlCmd: function() {
        if (vscode.window.activeTextEditor) {
            let markdown = md.render(vscode.window.activeTextEditor.document.getText()),
                channel = vscode.window.createOutputChannel('\''+path.basename(provider.fname)+'\' as html');
                html = `<!DOCTYPE html><html><head><meta charset='utf-8'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.4.1/github-markdown.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
</head><body>
${markdown}
</body></html>`;

            channel.show(false);  // don't take focus ..
            channel.append(html);
        }
        else
          vscode.window.showInformationMessage('Cannot show source of that document !');
    }
/*
    viewColumn: function(sideBySide) {
        var active = vscode.window.activeTextEditor;

        return !active ? vscode.ViewColumn.One
             : !sideBySide ? active.viewColumn
             : active.viewColumn === vscode.ViewColumn.One ? vscode.ViewColumn.Two
//             : active.viewColumn === vscode.ViewColumn.Two ? vscode.ViewColumn.Three
             : active.viewColumn;
    }
*/
};

// this method is called when your extension is activated ..
function activate(context) {
    let reg1 = vscode.workspace.registerTextDocumentContentProvider('mdmath', provider),
        reg2 = vscode.commands.registerCommand('extension.mdmath', provider.previewCmd),
        reg3 = vscode.commands.registerCommand('extension.mdmathToHtml', provider.saveAsHtmlCmd);

    provider.basePath = context.asAbsolutePath('.');
    provider.package = require(context.asAbsolutePath('./package.json'));

    vscode.workspace.onDidChangeTextDocument(provider.onDidChangeTextDocument, provider);
    vscode.window.onDidChangeActiveTextEditor(provider.onDidChangeActiveTextEditor, provider);

    context.subscriptions.push(reg1, reg2, reg3);

    console.log("mdmath activated !")
}

exports.activate = activate;
exports.deactivate = function deactivate() {};
