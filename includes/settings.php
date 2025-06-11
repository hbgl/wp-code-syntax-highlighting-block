<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

add_action('admin_init', function () {
    require_once __DIR__ . '/manifest.php';

    register_setting(
        'code-syntax-highlighting-block',
        'cshb_options',
        [
            'type' => 'array',
            'sanitize_callback' => function ($input) {
                return CshbOptions::fromArray(is_array($input) ? $input : [])->toArray();
            },
        ],
    );

    add_settings_section(
        'cshb_section_theme',
        __('Theme Settings', 'code-syntax-highlighting-block'),
        '__return_null',
        'code-syntax-highlighting-block',
    );

    add_settings_field(
        'cshb_field_theme_default',
        __('Default Theme', 'code-syntax-highlighting-block'),
        function ($args) {
            $value = cshb_options()->themeDefault;
            $themes = cshb_manifest()->themes;
            ?>
            <select
                id="<?php echo esc_attr($args['label_for']); ?>"
                name="cshb_options[theme_default]"
            >
                <option value="" <?php selected($value, ''); ?>></option>
                <?php foreach ($themes as $theme) { ?>
                    <option value="<?php echo esc_attr($theme); ?>" <?php selected($value, $theme); ?>>
                        <?php echo esc_html($theme); ?>
                    </option>
                <?php } ?>
            </select>
            <?php
        },
        'code-syntax-highlighting-block',
        'cshb_section_theme',
        ['label_for' => 'cshb_field_theme_default'],
    );

    add_settings_field(
        'cshb_field_theme_light_default',
        __('Default Theme (light)', 'code-syntax-highlighting-block'),
        function ($args) {
            $value = cshb_options()->themeLightDefault;
            $themes = cshb_manifest()->themes;
            ?>
            <select
                id="<?php echo esc_attr($args['label_for']); ?>"
                name="cshb_options[theme_light_default]"
            >
                <option value="" <?php selected($value, ''); ?>></option>
                <?php foreach ($themes as $theme) { ?>
                    <option value="<?php echo esc_attr($theme); ?>" <?php selected($value, $theme); ?>>
                        <?php echo esc_html($theme); ?>
                    </option>
                <?php } ?>
            </select>
            <?php
        },
        'code-syntax-highlighting-block',
        'cshb_section_theme',
        ['label_for' => 'cshb_field_theme_light_default'],
    );

    add_settings_field(
        'cshb_field_theme_dark_default',
        __('Default Theme (dark)', 'code-syntax-highlighting-block'),
        function ($args) {
            $value = cshb_options()->themeDarkDefault;
            $themes = cshb_manifest()->themes;
            ?>
            <select
                id="<?php echo esc_attr($args['label_for']); ?>"
                name="cshb_options[theme_dark_default]"
            >
                <option value="" <?php selected($value, ''); ?>></option>
                <?php foreach ($themes as $theme) { ?>
                    <option value="<?php echo esc_attr($theme); ?>" <?php selected($value, $theme); ?>>
                        <?php echo esc_html($theme); ?>
                    </option>
                <?php } ?>
            </select>
            <?php
        },
        'code-syntax-highlighting-block',
        'cshb_section_theme',
        ['label_for' => 'cshb_field_theme_dark_default'],
    );

    add_settings_field(
        'cshb_field_theme_favorites',
        __('Favorite Themes', 'code-syntax-highlighting-block'),
        function ($args) {
            $selectedLookup = array_flip(cshb_options()->themeFavorites);
            $selectedThemes = [];
            $unselectedThemes = [];
            foreach (cshb_manifest()->themes as $theme) {
                if (array_key_exists($theme, $selectedLookup)) {
                    $selectedThemes[] = $theme;
                } else {
                    $unselectedThemes[] = $theme;
                }
            }
            ?>
            <select
                id="<?php echo esc_attr($args['label_for']); ?>"
                name="cshb_options[theme_favorites][]"
                multiple
                size="10"
            >
                <?php if (count($selectedThemes) > 0): ?>
                    <?php foreach ($selectedThemes as $theme): ?>
                        <option value="<?php echo esc_attr($theme); ?>" selected>
                            <?php echo esc_html($theme); ?>
                        </option>
                    <?php endforeach; ?>
                    <?php if (count($unselectedThemes) > 0): ?>
                        <option disabled>-------------------------</option>
                    <?php endif; ?>
                <?php endif; ?>
                <?php if (count($unselectedThemes) > 0): ?>
                    <?php foreach ($unselectedThemes as $theme): ?>
                        <option value="<?php echo esc_attr($theme); ?>">
                            <?php echo esc_html($theme); ?>
                        </option>
                    <?php endforeach; ?>
                <?php endif; ?>
            </select>
            <p class="description">
		        <?php esc_html_e('Favorites are faster to select in the Gutenberg editor.', 'code-syntax-highlighting-block'); ?>
	        </p>
            <?php
        },
        'code-syntax-highlighting-block',
        'cshb_section_theme',
        ['label_for' => 'cshb_field_theme_favorites'],
    );

    add_settings_section(
        'cshb_section_language',
        __('Language Settings', 'code-syntax-highlighting-block'),
        '__return_null',
        'code-syntax-highlighting-block',
    );

    add_settings_field(
        'cshb_field_language_default',
        __('Default Language', 'code-syntax-highlighting-block'),
        function ($args) {
            $value = cshb_options()->languageDefault;
            $languages = cshb_manifest()->languages;
            ?>
            <select
                id="<?php echo esc_attr($args['label_for']); ?>"
                name="cshb_options[language_default]"
            >
                <option value="" <?php selected($value, ''); ?>></option>
                <?php foreach ($languages as $language): ?>
                    <option value="<?php echo esc_attr($language); ?>" <?php selected($value, $language); ?>>
                        <?php echo esc_html($language); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <?php
        },
        'code-syntax-highlighting-block',
        'cshb_section_language',
        ['label_for' => 'cshb_field_default_language'],
    );

    add_settings_field(
        'cshb_field_language_favorites',
        __('Favorite Languages', 'code-syntax-highlighting-block'),
        function ($args) {
            $selectedLookup = array_flip(cshb_options()->languageFavorites);
            $selectedLanguages = [];
            $unselectedLanguages = [];
            foreach (cshb_manifest()->languages as $language) {
                if (array_key_exists($language, $selectedLookup)) {
                    $selectedLanguages[] = $language;
                } else {
                    $unselectedLanguages[] = $language;
                }
            }
            ?>
            <select
                id="<?php echo esc_attr($args['label_for']); ?>"
                name="cshb_options[language_favorites][]"
                multiple
                size="10"
            >
                <?php if (count($selectedLanguages) > 0): ?>
                    <?php foreach ($selectedLanguages as $language): ?>
                        <option value="<?php echo esc_attr($language); ?>" selected>
                            <?php echo esc_html($language); ?>
                        </option>
                    <?php endforeach; ?>
                    <?php if (count($unselectedLanguages) > 0): ?>
                        <option disabled>-------------------------</option>
                    <?php endif; ?>
                <?php endif; ?>
                <?php if (count($unselectedLanguages) > 0): ?>
                    <?php foreach ($unselectedLanguages as $language): ?>
                        <option value="<?php echo esc_attr($language); ?>">
                            <?php echo esc_html($language); ?>
                        </option>
                    <?php endforeach; ?>
                <?php endif; ?>
            </select>
            <p class="description">
		        <?php esc_html_e('Favorites are faster to select in the Gutenberg editor.', 'code-syntax-highlighting-block'); ?>
	        </p>
            <?php
        },
        'code-syntax-highlighting-block',
        'cshb_section_language',
        ['label_for' => 'cshb_field_language_favorites'],
    );
});

add_action('admin_menu', function () {
    add_options_page(
        __('Code Syntax Highlight Settings', 'code-syntax-highlighting-block'),
        __('Code Syntax Highlight', 'code-syntax-highlighting-block'),
        'manage_options',
        'code-syntax-highlighting-block',
        function () {
            if (! current_user_can('manage_options')) {
                return;
            }
            ?>
            <div class="wrap">
                <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
                <form action="options.php" method="post">
                    <?php
                    settings_fields('code-syntax-highlighting-block');
            do_settings_sections('code-syntax-highlighting-block');
            submit_button(__('Save Settings', 'code-syntax-highlighting-block'));
            ?>
                </form>
            </div>
            <?php
        }
    );
});

add_action('enqueue_block_editor_assets', function () {
    $options = cshb_options();
    $optionsJson = wp_json_encode($options->toArray(), \JSON_HEX_TAG);
    if ($optionsJson !== false) {
        wp_add_inline_script(
            'code-syntax-highlighting-block-code-syntax-highlighting-block-editor-script',
            "window['code-syntax-highlighting-block-options'] = {$optionsJson};",
            'before',
        );
    }
});

function cshb_options(): CshbOptions
{
    return CshbOptions::fromArray(get_option('cshb_options', []));
}

function cshb_settings_activation_callback()
{
    if (get_option('cshb_options', false) !== false) {
        return;
    }

    add_option('cshb_options', CshbOptions::defaults()->toArray());
}

final class CshbOptions
{
    private const VERSION = 1;

    /**
     * @param list<string> $themeFavorites
     * @param list<string> $languageFavorites
     */
    public function __construct(
        public readonly string $themeDefault,
        public readonly string $themeLightDefault,
        public readonly string $themeDarkDefault,
        public readonly array $themeFavorites,
        public readonly string $languageDefault,
        public readonly array $languageFavorites,
    ) {
    }

    public static function defaults(): self
    {
        return new self(
            'atom-one-light',
            '',
            '',
            [
                'atom-one-dark',
                'atom-one-light',
            ],
            'php',
            [
                'css',
                'html',
                'javascript',
                'php',
                'sql',
                'typescript',
            ],
        );
    }

    public static function fromArray(array $array): self
    {
        $themeDefault = $array['theme_default'] ?? '';
        if (! is_string($themeDefault)) {
            $themeDefault = '';
        }

        $themeLightDefault = $array['theme_light_default'] ?? '';
        if (! is_string($themeLightDefault)) {
            $themeLightDefault = '';
        }

        $themeDarkDefault = $array['theme_dark_default'] ?? '';
        if (! is_string($themeDarkDefault)) {
            $themeDarkDefault = '';
        }

        $themeFavorites = $array['theme_favorites'] ?? [];
        if (! is_array($themeFavorites)) {
            $themeFavorites = [];
        }
        $themeFavorites = array_values(array_filter($themeFavorites, 'is_string'));

        $languageDefault = $array['language_default'] ?? '';
        if (! is_string($languageDefault)) {
            $languageDefault = '';
        }

        $languageFavorites = $array['language_favorites'] ?? [];
        if (! is_array($languageFavorites)) {
            $languageFavorites = [];
        }
        $languageFavorites = array_values(array_filter($languageFavorites, 'is_string'));

        return new self(
            $themeDefault,
            $themeLightDefault,
            $themeDarkDefault,
            $themeFavorites,
            $languageDefault,
            $languageFavorites,
        );
    }

    public function toArray(): array
    {
        return [
            '__version' => self::VERSION,
            'theme_default' => $this->themeDefault,
            'theme_light_default' => $this->themeLightDefault,
            'theme_dark_default' => $this->themeDarkDefault,
            'theme_favorites' => $this->themeFavorites,
            'language_default' => $this->languageDefault,
            'language_favorites' => $this->languageFavorites,
        ];
    }
}
