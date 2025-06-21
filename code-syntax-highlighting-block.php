<?php

/**
 * Plugin Name:       Code Syntax Highlighting Block
 * Description:       Block for displaying computer code with syntax highlighting.
 * Version:           1.1.1
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

define('CODE_SYNTAX_HIGHLIGHTING_BLOCK_VERSION', '1.1.0');

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

add_action('plugins_loaded', function () { // Migration
    if (! is_admin() || wp_doing_ajax() || ! current_user_can('activate_plugins')) {
        return;
    }

    // Not atomic but probably good enough.
    $storedVersion = get_option('cshb_version', '0.0.0');
    if ($storedVersion === CODE_SYNTAX_HIGHLIGHTING_BLOCK_VERSION) {
        return;
    }
    $transientUnique = uniqid('', true);
    if (get_transient('cshb_migration_lock') !== false) {
        return;
    }
    if (! set_transient('cshb_migration_lock', $transientUnique, 300)) {
        return;
    }

    try {
        assert(is_string($storedVersion));
        cshb_settings_migrate($storedVersion);

        update_option('cshb_version', CODE_SYNTAX_HIGHLIGHTING_BLOCK_VERSION);
    } finally {
        if (get_transient('cshb_migration_lock') === $transientUnique) {
            delete_transient('cshb_migration_lock');
        }
    }
});

/**
 * Enqueue default styles
 */
add_action('wp_enqueue_scripts', function() {
    $lineHeight = cshb_options()->lineHeight;

    if ($lineHeight !== null) {
        wp_register_style('cshb-default-styles', false);
        wp_enqueue_style('cshb-default-styles');
        wp_add_inline_style(
            'cshb-default-styles',
            <<<DATA
            .wp-block-code-syntax-highlighting-block-code-syntax-highlighting-block {
                line-height: {$lineHeight->value};
            }
            DATA,
        );
    }
}, 20); // Priority after theme

function cshb_uninstall(): void {
    cshb_settings_uninstall();
    delete_option('cshb_version');
}

register_uninstall_hook( __FILE__, 'cshb_uninstall');