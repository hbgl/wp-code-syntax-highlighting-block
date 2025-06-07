const { readdir, copyFile, writeFile, rm } = require('node:fs/promises');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { createReadStream } = require('node:fs');
const hljs = require('highlight.js');

const projectRoot = path.dirname(path.dirname(__dirname));
const themeSourceDir = path.resolve(projectRoot, 'node_modules/highlight.js/styles');
const themeStylesheetDestDir = path.resolve(projectRoot, 'public/css/themes');
const themeManifestJsDestFilePath = path.resolve(projectRoot, 'src/code-syntax-highlighting-block/generated/theme-manifest.generated.js');
const manifestPhpFilePath = path.resolve(projectRoot, 'includes/generated/manifest.generated.php');

/**
 * @typedef {Object} ThemeEntry
 * @property {string} name
 * @property {string} destName
 * @property {string} srcPath
 * @property {string} contentHash
 */

/**
 * @returns {ThemeEntry[]}
 */
async function readSourceThemes() {
    const themes = new Map();

    const themeDirNames = [
        '',
        'base16',
    ];

    for (const themeDirName of themeDirNames) {
        const themeDir = path.join(themeSourceDir, themeDirName);
        const files = await readdir(themeDir);
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

            const themeSrcPath = path.join(themeDir, file);
            const contentHash = await hashFileContent(themeSrcPath);

            themes.set(name, {
                name: name,
                destName: `${name}.min.css`,
                srcPath: themeSrcPath,
                contentHash: contentHash,
            });
        }
    }

    const themeList = Array.from(themes.values());
    themeList.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    return themeList;
}

/**
 * @param {ThemeEntry[]} themes 
 */
async function writeThemeStylesheets(themes) {
    /** @type {Map<string, ThemeEntry>} */
    const copyThemes = new Map();
    for (const theme of themes) {
        copyThemes.set(theme.destName, theme);
    }

    for (const existingFile of await readdir(themeStylesheetDestDir)) {
        if (!existingFile.endsWith('.min.css')) {
            continue;
        }

        const theme = copyThemes.get(existingFile);
        if (theme === undefined) {
            unlink(path.join(themeStylesheetDestDir, existingFile));
            continue;
        }

        const existingContentHash = await hashFileContent(path.join(themeStylesheetDestDir, existingFile));
        if (existingContentHash === theme.contentHash) {
            copyThemes.delete(existingFile);
        }
    }

    for (const { srcPath, destName } of copyThemes.values()) {
        const destPath = path.join(themeStylesheetDestDir, destName);
        await copyFile(srcPath, destPath);
    }
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
    await writeFile(themeManifestJsDestFilePath, themesJs);
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

    await writeFile(manifestPhpFilePath, php);
}

/**
 * @param {string} path 
 * @returns {string}
 */
function hashFileContent(path) {
    return new Promise((resolve, reject) => {
        const hash = createHash('sha256');
        const stream = createReadStream(path);

        stream.on('error', reject);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}

module.exports = {
    buildAssets: async function () {
        const themes = await readSourceThemes();
        await writeThemeStylesheets(themes);
        await writeThemeManifestJsFile(themes);
        await writeManifestPhpFile(themes);
    }
};