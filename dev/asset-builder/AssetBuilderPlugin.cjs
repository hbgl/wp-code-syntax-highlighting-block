const { buildAssets } = require('./asset-builder');

class CopyHighlightJsThemesPlugin {
	apply(compiler) {
        const pluginName = 'CopyHighlightJsThemesPlugin';

        let ran = false;

        const runOnce = async (compiler) => {
            if (ran) {
                return;
            }
			const logger = compiler.getInfrastructureLogger(pluginName);
            logger.info('⏳ Building custom assets');
            const start = performance.now();
            await buildAssets();
            const end = performance.now();
            logger.info(`✅ Building custom assets completed in ${Math.round(end - start)}ms`);
            ran = true;
		};

		compiler.hooks.beforeRun.tapPromise(pluginName, runOnce);
        compiler.hooks.watchRun.tapPromise(pluginName, runOnce);
	}
}

module.exports = CopyHighlightJsThemesPlugin;