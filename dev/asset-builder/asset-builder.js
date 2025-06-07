const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const hljs = require('highlight.js');
const postcss = require('postcss');

const projectRoot = path.dirname(path.dirname(__dirname));
const themeSourceDir = path.resolve(projectRoot, 'node_modules/highlight.js/styles');
const themeStylesheetDestDir = path.resolve(projectRoot, 'public/css/themes');
const themeManifestJsDestFilePath = path.resolve(projectRoot, 'src/code-syntax-highlighting-block/generated/theme-manifest.generated.js');
const manifestPhpFilePath = path.resolve(projectRoot, 'includes/generated/manifest.generated.php');

/**
 * @typedef {Object} ThemeSourceEntry
 * @property {string} name
 * @property {string} destName
 * @property {string} srcPath
 */

/**
 * @typedef {Object} ThemeEntry
 * @property {string} name
 * @property {string} destName
 * @property {string} srcPath
 * @property {string} contentHash
 */

/**
 * @returns {ThemeSourceEntry[]}
 */
async function readSourceThemes() {
    /** @type {Map<string, ThemeSourceEntry>} */
    const themes = new Map();

    const themeDirNames = [
        '',
        'base16',
    ];

    for (const themeDirName of themeDirNames) {
        const themeDir = path.join(themeSourceDir, themeDirName);
        const files = await fs.readdir(themeDir);
        for (const file of files) {
            if (!file.endsWith('.min.css')) {
                continue;
            }
            const themeName = file.slice(0, -8);
            if (themeName === '') {
                continue;
            }

            const suffix = themeDirName === '' ? '' : `-${themeDirName}`;
            const name = `${themeName}${suffix}`;
            if (themes.has(name)) {
                continue;
            }

            themes.set(name, {
                name: name,
                destName: `${name}.min.css`,
                srcPath: path.join(themeDir, file),
            });
        }
    }

    const themeList = Array.from(themes.values());
    themeList.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    return themeList;
}

/**
 * @param {ThemeSourceEntry[]} sourceThemes
 * @returns {ThemeEntry[]}
 */
async function writeThemeStylesheetsAndCalculateContentHash(sourceThemes) {
    // Clean up themes which are no longer supported.
    const themeDestNames = new Set(sourceThemes.map(t => t.destName));
    for (const existingFile of await fs.readdir(themeStylesheetDestDir)) {
        if (! existingFile.endsWith('.min.css')) {
            continue;
        }
        const themeIsNoLongerSupported = ! themeDestNames.has(existingFile);
        if (themeIsNoLongerSupported) {
            await fs.unlink(path.join(themeStylesheetDestDir, existingFile));
            continue;
        }
    }

    /**
     * There some themes that use the :root selector to define
     * variables. Since we are using the stylesheet inside of
     * the shadow DOM where there is no root, the variables will
     * not applied.
     * Fix: Rewrite :root to :host.
     */
    const postcssProcessor = postcss([
        (root) => {
            root.walkRules(rule => {
                const selector = rule.selector.trim();
                if (selector === ':root') {
                    rule.selector = ':root,:host';
                }
            });
        },
    ]);

    /** @type {ThemeEntry[]} */
    const result = [];

    for (const theme of sourceThemes) {
        const cssOriginal = await fs.readFile(theme.srcPath, 'utf-8');
        const postcssResult = await postcssProcessor.process(
            cssOriginal,
            {
                from: theme.srcPath,
                map: false,
            },
        );
        const transformedCss = postcssResult.css;

        const existingContentHash = await hashFileContent(path.join(themeStylesheetDestDir, theme.destName));
        const newContentHash = hashContent(transformedCss);
        if (existingContentHash !== newContentHash) {
            const destPath = path.join(themeStylesheetDestDir, theme.destName);
            await fs.writeFile(destPath, transformedCss);
        }

        result.push({
            ...theme,
            contentHash: newContentHash,
        });
    }

    return result;
}

/**
 * @param {ThemeEntry[]} themes 
 */
async function writeThemeManifestJsFile(themes) {
    const themeEntries = {};
    for (const theme of themes){
        themeEntries[theme.name] = {
            name: theme.name,
            stylesheetFileName: theme.destName,
            stylesheetContentHash: theme.contentHash,
        }
    }
    const themesJs = (
        '// Auto-generated. Do not modify. Run `npm run theme:update` to update.\n' +
        '\n' +
        '/**\n' +
        ' * @type  {Record<string, {name: string, stylesheetFileName: string, stylesheetContentHash: string}>}\n' +
        ' */\n' +
        `export const themes = ${JSON.stringify(themeEntries, null, 4)};\n` +
        '\n'
    );
    await fs.writeFile(themeManifestJsDestFilePath, themesJs);
}

/**
 * @param {ThemeEntry[]} themes 
 */
async function writeManifestPhpFile(themes) {
    let php = (
        '<?php\n' +
        '// Auto-generated. Do not modify. Run `npm run theme:update` to update.\n' +
        '\n' +
        'if (! defined(\'ABSPATH\')) {\n' +
        '    exit; // Exit if accessed directly.\n' +
        '}\n' +
        '\n' +
        'return [\n'
    );

    php += '    \'themes\' => [\n';
    for (const theme of themes) {
        const themePhpString = theme.name.replaceAll(/'|\\/g, c => `\\${c}`);
        php += `        '${themePhpString}',\n`;
    }
    php += '    ],\n';

    php += '    \'languages\' => [\n';
    const languages = hljs.listLanguages().sort();
    for (const language of languages) {
        const languagePhpString = language.replaceAll(/'|\\/g, c => `\\${c}`);
        php += `        '${languagePhpString}',\n`;
    }
    php += '    ],\n';

    php += '];\n';

    await fs.writeFile(manifestPhpFilePath, php);
}

/**
 * @param {string} path 
 * @returns {string|false}
 */
async function hashFileContent(path) {
    try {
        var file = await fs.open(path, 'r');
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        }
    }

    const hash = crypto.createHash('sha256');
    for await (const chunk of file.createReadStream()) {
      hash.update(chunk);
    }
    await file.close();
    
    return hash.digest('hex');
}

/**
 * @param {string} path 
 * @returns {string}
 */
function hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
}

module.exports = {
    buildAssets: async function () {
        const sourceThemes = await readSourceThemes();
        const themes = await writeThemeStylesheetsAndCalculateContentHash(sourceThemes);
        await writeThemeManifestJsFile(themes);
        await writeManifestPhpFile(themes);
    }
};