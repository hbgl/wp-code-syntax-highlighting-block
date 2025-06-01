const { copyHighlightJsThemes } = require('./copy-highlight-js-themes');

class CopyHighlightJsThemesPlugin {
	apply(compiler) {
        const pluginName = 'CopyHighlightJsThemesPlugin';

        let ran = false;

        const runOnce = async (compiler) => {
            if (ran) {
                return;
            }
			const logger = compiler.getInfrastructureLogger(pluginName);
            logger.info('⏳ Copying highlight.js themes');
            const start = performance.now();
            const results = await copyHighlightJsThemes();
            const end = performance.now();
            logger.info(`✅ Copied ${results.themeCount} themes ${Math.round(end - start)}ms to ${results.themeDestDir} and wrote to ${results.manifestDestFile}`);
            ran = true;
		};

		compiler.hooks.beforeRun.tapPromise(pluginName, runOnce);
        compiler.hooks.watchRun.tapPromise(pluginName, runOnce);
	}
}

module.exports = CopyHighlightJsThemesPlugin;