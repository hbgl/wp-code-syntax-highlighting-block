const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const CopyHighlightJsThemesPlugin = require('./dev/copy-highlight-js-themes/CopyHighlightJsThemesPlugin.cjs');

module.exports = {
    ...defaultConfig,
    plugins: [
        new CopyHighlightJsThemesPlugin(),
        ...defaultConfig.plugins,
    ],
};