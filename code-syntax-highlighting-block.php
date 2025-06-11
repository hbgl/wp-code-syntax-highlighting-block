<?php

/**
 * Plugin Name:       Code Syntax Highlighting Block
 * Description:       Block for displaying computer code with syntax highlighting.
 * Version:           1.0.0
 * Requires at least: 6.7
 * Requires PHP:      8.1
 * Author:            hbgl
 * Author URI:        https://hbgl.dev
 * License:           MIT
 * License URI:       https://opensource.org/license/MIT
 * Text Domain:       code-syntax-highlighting-block
 *
 * @package CreateBlock
 */

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

add_action('init', function () {
    if (function_exists('wp_register_block_types_from_metadata_collection')) {
        wp_register_block_types_from_metadata_collection(__DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php');
        return;
    }

    if (function_exists('wp_register_block_metadata_collection')) {
        wp_register_block_metadata_collection(__DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php');
    }

    $manifest_data = require __DIR__ . '/build/blocks-manifest.php';
    foreach (array_keys($manifest_data) as $block_type) {
        register_block_type(__DIR__ . "/build/{$block_type}");
    }
});

require_once plugin_dir_path(__FILE__) . 'includes/settings.php';

register_activation_hook(__FILE__, 'cshb_settings_activation_callback');
