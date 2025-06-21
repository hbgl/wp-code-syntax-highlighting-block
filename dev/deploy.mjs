import { $, cd, chalk, echo, fs, glob, minimist, path, question } from "zx"
import unzipper from 'unzipper';

const argv = minimist(process.argv.slice(2), {
    boolean: [
        'help',
    ],
    string: [
        'svn-dir',
        'project-dir',
    ],
    alias: {
        h: 'help',
    },
});

function printHelp() {
    echo(
        'Deployment script for code-syntax-highlighting-block Wordpress plugin\n' +
        '\n' +
        'Usage: node deploy.mjs --svn-dir <path> [--project-dir <path>]\n' +
        '\n' +
        'Options:\n' +
        '  --svn-dir       (required) Path to SVN working copy\n' +
        '  --project-dir   (optional) Path to project directory. Defaults to CWD\n' +
        '  -h, --help      Show this help message'
    );
}

if (argv.help) {
    printHelp();
    process.exit(1);
}

if (! argv['svn-dir']) {
    echo(chalk.red('Missing required argument: --svn-dir'));
    echo('');
    printHelp();
    process.exit(1);
}

const PROJECT_DIR = path.normalize(argv['project-dir'] ?? process.cwd());
const SVN_DIR = path.normalize(argv['svn-dir']);

const PLUGIN_NAME = 'code-syntax-highlighting-block'
const GIT_DEPLOY_BRANCH = 'master';
const PROJECT_ASSETS_DIR = `${PROJECT_DIR}/assets/release`;
const EXTRACT_TEMP_DIR = path.join(SVN_DIR, '__cshb_temp_extract__');

// ---- Basic checks

if (!SVN_DIR) {
    errorExit('Error: You must set CSHB_SVN_DIR environment variable');
}

(await dirExists(PROJECT_DIR)) || errorExit(`Error: PROJECT_DIR does not exist: ${PROJECT_DIR}`);
(await dirExists(PROJECT_ASSETS_DIR)) || errorExit(`Error: Project assets directory does not exist: ${PROJECT_ASSETS_DIR}`);
(await dirExists(SVN_DIR)) || errorExit(`Error: SVN_DIR does not exist: ${SVN_DIR}`);

const PACKAGE_JSON_PATH = path.join(PROJECT_DIR, 'package.json');
(await fileExists(PACKAGE_JSON_PATH)) || errorExit(`Error: package.json does not exist in ${PACKAGE_JSON_PATH}`);

const packageJson = JSON.parse(await fs.readFile(PACKAGE_JSON_PATH, 'utf-8'));
if (packageJson.name !== PLUGIN_NAME) {
    errorExit(`Error: Unexpected package name: expected "${PLUGIN_NAME}", got "${packageJson.name}"`);
}
if (!packageJson.version) {
    errorExit('Error: No version found in package.json');
}

const PACKAGE_VERSION = packageJson.version;

// ---- Verify clean Git project directory

cd(PROJECT_DIR);

await ($`git rev-parse --is-inside-work-tree`).catch(() => {
    errorExit(`Error: Project directory is not a Git repository: ${PROJECT_DIR}`);
});

const GIT_CURRENT_BRANCH = (await $`git rev-parse --abbrev-ref HEAD`).stdout.trim();
if (GIT_CURRENT_BRANCH !== GIT_DEPLOY_BRANCH) {
    errorExit(`Error: Not on ${GIT_DEPLOY_BRANCH} branch (current: ${GIT_CURRENT_BRANCH})`);
}

if ((await $`git status --porcelain`).stdout.trim()) {
    await $({ verbose: true })`git status`;
    errorExit(`Error: Git working directory is not clean: ${PROJECT_DIR}`);
}

// ---- Verify clean SVN working copy

cd(SVN_DIR);

await fs.rm(EXTRACT_TEMP_DIR, { recursive: true, force: true });

(await dirExists(path.join(SVN_DIR, '.svn'))) || errorExit(`Error: SVN directory does not contain .svn metadata: ${SVN_DIR}`);

if ((await $`svn status`).stdout.trim()) {
    await $({ verbose: true })`svn status`;
    errorExit(`Error: SVN working directory is not clean: ${SVN_DIR}`);
}

// ---- Verify SVN tag version does not exist

const SVN_TAGS_DIR = path.join(SVN_DIR, 'tags');
const SVN_TAG_VERSION_DIR = path.join(SVN_TAGS_DIR, PACKAGE_VERSION);

!(await dirExists(SVN_TAG_VERSION_DIR)) || errorExit(`Error: SVN tag directory already exists: ${SVN_TAG_VERSION_DIR}`);

// ---- Confirm preparation

echo('Ready to prepare release:')
echo(`  Project directory  : ${PROJECT_DIR}`);
echo(`  SVN directory      : ${SVN_DIR}`);
echo(`  Plugin name        : ${chalk.yellow(PLUGIN_NAME)}`);
echo(`  Version to release : ${chalk.yellow(PACKAGE_VERSION)}`);
echo('');

await askForContinuation('Continue with preparation?');

// ---- Build and zip plugin

cd(PROJECT_DIR);

echo('');
await $({ verbose: true })`npm run build`;

echo('');
await $({ verbose: true })`npm run plugin-zip`;

// ---- Extract ZIP into SVN trunk

const ZIP_FILE_PATH = path.join(PROJECT_DIR, `${PLUGIN_NAME}.zip`);
const SVN_TRUNK_DIR = path.join(SVN_DIR, 'trunk');
const PLUGIN_FILES_EXTRACTED_DIR = path.join(EXTRACT_TEMP_DIR, PLUGIN_NAME);

await (await unzipper.Open.file(ZIP_FILE_PATH)).extract({ path: EXTRACT_TEMP_DIR });

(await dirExists(PLUGIN_FILES_EXTRACTED_DIR)) || errorExit(`Error: Unexpected zip structure. Expected zip to contain directory ${PLUGIN_NAME}: ${EXTRACT_TEMP_DIR}`);

await fs.rm(SVN_TRUNK_DIR, { recursive: true, force: true });

await fs.cp(PLUGIN_FILES_EXTRACTED_DIR, SVN_TRUNK_DIR, { recursive: true });

await fs.rm(EXTRACT_TEMP_DIR, { recursive: true, force: true, });

cd(SVN_TRUNK_DIR);

await $`svn add --force . --auto-props --parents --depth infinity`;

// ---- Create SVN version tag

cd(SVN_DIR);

fs.mkdir(SVN_TAGS_DIR, { recursive: true });

await $`svn copy ${SVN_TRUNK_DIR.replaceAll('\\', '/')} ${SVN_TAG_VERSION_DIR.replaceAll('\\', '/')}`;

// ---- Copy assets

const SVN_ASSETS_DIR = path.join(SVN_DIR, 'assets');

await fs.rm(SVN_ASSETS_DIR, { recursive: true, force: true });

await fs.cp(PROJECT_ASSETS_DIR, SVN_ASSETS_DIR, { recursive: true });

cd(SVN_ASSETS_DIR);

await $`svn add --force . --auto-props --parents --depth infinity`;

for (const entry of await glob('**/*.png')) {
    await $`svn propset svn:mime-type image/png ${entry.replaceAll('\\', '/')}`;
}

for (const entry of await glob('**/*.jpg')) {
    await $`svn propset svn:mime-type image/jpeg ${entry.replaceAll('\\', '/')}`;
}

for (const entry of await glob('**/*.svg')) {
    await $`svn propset svn:mime-type image/svg+xml ${entry.replaceAll('\\', '/')}`;
}

// ---- Commit

echo('');
echo(chalk.bold(`You are about to release version ${PACKAGE_VERSION} of plugin ${PLUGIN_NAME}.`));
echo('');
await askConfirmedValue(`Enter ${chalk.yellow(`${PLUGIN_NAME}@${PACKAGE_VERSION}`)} to confirm the release: `, `${PLUGIN_NAME}@${PACKAGE_VERSION}`);
echo('\n');

cd(SVN_DIR);

await $({ verbose: true })`svn commit -m "Release version ${PACKAGE_VERSION}"`;

echo('');
echo(chalk.green(`✓ Version ${PACKAGE_VERSION} of plugin ${PLUGIN_NAME} was succesfully release!`));
echo('');

// ---- LIB

/**
 * @param {string} path 
 * @returns {Promise<boolean>}
 */
async function fileExists(path) {
    try {
        return (await fs.stat(path)).isFile();
    } catch {
        return false;
    }
}

/**
 * @param {string} path 
 * @returns {Promise<boolean>}
 */
async function dirExists(path) {
    try {
        return (await fs.stat(path)).isDirectory();
    } catch {
        return false;
    }
}

/**
 * @param {string} message 
 * @returns {never}
 */
function errorExit(message) {
    echo(chalk.red(message));
    process.exit(1);
}

/**
 * @param {string} message 
 */
async function askForContinuation(message) {
    for (; ;) {
        const confirmPreparation = (await question(`${message} (Y/n) `, { choices: ['y', 'n'] })).toLowerCase();
        if (confirmPreparation === 'no' || confirmPreparation === 'n') {
            errorExit('Aborting on user request...');
        }
        if (confirmPreparation === 'yes' || confirmPreparation === 'y' || confirmPreparation.trim() === '') {
            break;
        }
        echo('\nEnter y or n\n');
    }
}

/**
 * @param {string} message 
 * @param {string} value 
 */
async function askConfirmedValue(message, value) {
    for (; ;) {
        const confirmPreparation = await question(message);
        if (confirmPreparation === value) {
            break;
        }
        echo('\nWrong input\n');
    }
}
