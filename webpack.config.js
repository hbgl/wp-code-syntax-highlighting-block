const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const AssetBuilderPlugin = require('./dev/asset-builder/AssetBuilderPlugin.cjs');

module.exports = {
    ...defaultConfig,
    plugins: [
        new AssetBuilderPlugin(),
        ...defaultConfig.plugins,
    ],
};