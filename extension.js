/**
 * mdmath extension.js (c) 2016-2021 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/mdmath
 */
'use strict';

const vscode = require('vscode'),
      fs = require('fs'),
      path = require('path');
/**
 * Static VSCode Extension Object.
 */
const ext = {
    /**
     * Cached markdown-it object
     */
    mdit: false, 
    /**
     * Access mdmath configuration keys in 'package.json'
     * @method
     * @returns {any}
     */
    cfg(key) { 
        return vscode.workspace.getConfiguration('mdmath')[key];
    },
    /**
     * Show information message
     * @method
     */
    infoMsg(msg) {
        vscode.window.showInformationMessage(`mdmath: ${msg}`);
    },
    /**
     * Show error message
     * @method
     */
    errMsg(msg) {
        vscode.window.showErrorMessage(`mdmath: ${msg}`);
    },
    /**
     * Markdown content => Html
     * @method
     * @returns {string}  Html
     */
    asHTML(markdown) {
        const usrcss = ext.cfg('style');
        const theme = ext.cfg('theme');
        const extPath = vscode.extensions.getExtension("goessner.mdmath").extensionPath;
        const tmplturi = path.resolve(extPath, './themes/', theme, './theme.js');
        const cssuri = path.resolve(extPath, './themes/', theme, './style.css');
        const template = require(tmplturi);
        const data = ext.frontmatter(markdown);

        data.content = ext.mdit.render(markdown); // frontmatter is obviously suppressed by markdown-it ... self.
        if (usrcss)
           data.usrcss = usrcss;

        data.cssuri = 'file:///' + cssuri;  // temporarily ... get from 'cdn' later

        return template.html(data)
                       .replace(/\sclass=\"code-line\"/g,'')
                       .replace(/\sdata-line=\"[0-9]+\"/g,'')
                       .replace(/\sdata-href=\".+?\"/g,'')
                       .replace(/<img src=\"vscode-resource:/g,'<img src="')
                       .replace(/(<h[1-6] id=\".+?)\-\d\"/g,'$1"')
    },
    /**
     * Extract frontmatter section from markdown content
     * @method
     * @returns {object} frontmatter data
     */
    frontmatter(markdown) {
        const data = {};
        let   frontmatter;
        
        markdown.replace(/^\s*?[{\-]{3}([\s\S]+?)[}\-.]{3}\s*?/g, ($0,$1) => { frontmatter = $1; return '';});

        if (frontmatter) {
            try { 
                frontmatter = JSON.parse(`{${frontmatter}}`);
                Object.assign(data, frontmatter);
            }
            catch (err) {
                const transform = (pos) => `in frontmatter: … ${frontmatter.substring(Math.max(0,pos-15),pos-1)}¿${frontmatter.substring(pos-1,Math.min(pos+15,frontmatter.length-1))} …`;
                const errstr = err.message.replace(/in JSON at position (\d+)/, ($0,$1) => { return transform(+$1)});
                ext.errMsg(errstr);
            }
        }

        return data;
    },
    /**
     * Extract headings from content.
     * @param {string}  text - page text (including frontmatter)
     * @returns {array} headings as `{str,permalink,level}` objects.
     */
    extractHeadings(text) {
        const hds = [... text.matchAll(/([#]+)\s+?(.*)/g)];
        const headings = [];

        for (const h of hds) {
            const level = h[1].length;
            const str = h[2].trim();
            const permalink = ext.mdit.render(h[0]).match(/.+?id=\"([^"]*?)\".*/)[1]
                                                   .replace(/-\d$/g, '');  // remove trailing hyphen and digit !
            headings.push({str,permalink,level});
        }
        return headings;
    },

    /**
     * Markdown content => System Clipboard
     * @method
     */
    clip() {
        const doc = vscode.window.activeTextEditor
                 && vscode.window.activeTextEditor.document;

        vscode.env.clipboard.writeText(ext.asHTML(doc.getText()))
            .then(()=>ext.infoMsg('Html copied to clipboard!'),
                    (err)=>ext.errMsg('Html copying to clipboard failed: ' + err.message));
    },
    /**
     * Save Html to file
     * @method
     */
    save(arg) {
        try {
            const doc = arg && arg.uri ? arg : vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
            if (!doc)
                ext.errMsg('Saving html failed: invalid editor document!');
            else if (doc.languageId !== 'markdown')
                ext.errMsg('Saving html failed: Active document is no markdown source document!');
            else if (doc.isUntitled)
                ext.errMsg('Saving html failed: current untitled markdown document needs to be saved once first!');
            else if (!ext.cfg('silent')) {
                fs.writeFileSync(ext.outputLocationOf(doc.uri), ext.asHTML(doc.getText()), 'utf8');
                ext.infoMsg(`Html saved to ${ext.outputLocationOf(doc.uri)} !`);
            }
        } catch (err) {
            ext.errMsg('Saving html failed: ' + err.message);
        }
    },
    insertToC(arg) {
        const doc = arg && arg.uri ? arg : vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
        const headings = ext.extractHeadings(doc.getText());
        let   toc = '';
        for (const h of headings)
            toc += `${Array(h.level-1).fill('  ').join('')}- [${h.str}](#${h.permalink})\n`;
        vscode.env.clipboard.writeText(toc);
        vscode.commands.executeCommand('editor.action.insertSnippet', {snippet: "$CLIPBOARD"} );
    },
    /**
     * Determine html output location file name
     * @method
     * @returns {string}  file name
     */
    outputLocationOf(uri) {
        const root = vscode.workspace.getWorkspaceFolder(uri),
              parsed = path.parse(uri.fsPath),
              savePath = ext.cfg('savePath')  // use https://code.visualstudio.com/updates/v1_31#_global-storage-path instead in future !
                            .replace('${file.name}', parsed.name)
                            .replace('${file.ext}', parsed.ext),
              out = savePath.startsWith('/') ? path.resolve(root, `.${savePath}`) : path.resolve(parsed.dir, savePath);

        return path.isAbsolute(out) ? out : path.resolve(parsed.dir, `./${parsed.name}.html`);
    },
    /**
     * Load user defined KaTeX macros
     * @method
     * @returns {object}  macros dictionary
     */
    loadMacros() {
        try {
            const macroUrl = ext.cfg('macroFile');
            const macros = macroUrl.length ? fs.readFileSync(path.resolve(macroUrl),'utf8')
                                           : JSON.stringify(ext.cfg('macros'))
            return JSON.parse(macros);
        } catch (err) {
            errMsg('Loading macros failed: ' + err.message);
        }
    },
    /**
     * Init autosave mechanism
     * @method
     */
    initAutoSave() {
        if (!ext.initAutoSave.watching && vscode.window.activeTextEditor) {
            const pattern = new vscode.RelativePattern(path.dirname(vscode.window.activeTextEditor.document.uri.fsPath), '**/*.md');
            const watcher = vscode.workspace.createFileSystemWatcher(pattern,false,false,true);
            watcher.onDidChange(save); 
            watcher.onDidCreate(save);
            ext.initAutoSave.watching = true;
        }
    }
}

exports.activate = function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.clipToHtml', ext.clip));
    context.subscriptions.push(vscode.commands.registerCommand('extension.saveToHtml', ext.save));
    context.subscriptions.push(vscode.commands.registerCommand('extension.insertToC', ext.insertToC));
    if (ext.cfg('autosave')) {  // Initialize autosave functionality ... if user defined !
        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(ext.initAutoSave));
    }

    return {
        extendMarkdownIt(md) {
            const tm = require('markdown-it-texmath');
            const delimiters = JSON.parse(JSON.stringify(ext.cfg('delimiters'))) || 'dollars'; // wondering why this JSON stuff is necessary ...
            const katexOptions = JSON.parse(JSON.stringify(ext.cfg('katexoptions') || '')) || {};
            const macros = katexOptions.macros = ext.loadMacros();
            const outerSpace = ext.cfg('outerspace') || false;
            const options =  { "engine": require('katex'),
                               "delimiters": delimiters,
                               "outerSpace": outerSpace,
                               "katexOptions": katexOptions
                             };

           (ext.mdit = md).use(tm, options);
           return ext.mdit;
        }
    }
}

exports.deactivate = function deactivate() {};

// for simple debugging only ...
function log(arg) {
    if (!log.outchannel) {
        log.outchannel = vscode.window.createOutputChannel('log');
        log.outchannel.show(true);
    }
    log.outchannel.appendLine(arg);
}
