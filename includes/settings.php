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

    add_settings_section(
        'cshb_section_font',
        __('Font Settings', 'code-syntax-highlighting-block'),
        '__return_null',
        'code-syntax-highlighting-block',
    );

    add_settings_field(
        'cshb_field_line_height',
        __('Line Height', 'code-syntax-highlighting-block'),
        function ($args) {
            $value = cshb_options()->lineHeight;
            ?>
            <select
                id="<?php echo esc_attr($args['label_for']); ?>"
                name="cshb_options[line_height]"
            >
                <?php if ($value === null): ?>
                    <option value="" selected></option>
                <?php endif; ?>
                <?php foreach (CshbLineHeight::cases() as $case): ?>
                    <option value="<?php echo esc_attr($case->value); ?>" <?php selected($value?->value, $case->value); ?>>
                        <?php echo esc_html($case->value); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <?php
        },
        'code-syntax-highlighting-block',
        'cshb_section_font',
        ['label_for' => 'cshb_field_line_height'],
    );

    add_settings_section(
        'cshb_section_editor',
        __('Editor Settings', 'code-syntax-highlighting-block'),
        '__return_null',
        'code-syntax-highlighting-block',
    );

    add_settings_field(
        'cshb_field_editor_indentation',
        __('Indentation', 'code-syntax-highlighting-block'),
        function ($args) {
            $value = cshb_options()->editorIndentation;
            ?>
            <select
                id="<?php echo esc_attr($args['label_for']); ?>"
                name="cshb_options[editor_indentation]"
            >
                <?php if ($value === null): ?>
                    <option value="" selected></option>
                <?php endif; ?>
                <?php foreach (CshbEditorIndentation::cases() as $case): ?>
                    <option value="<?php echo esc_attr($case->value); ?>" <?php selected($value?->value, $case->value); ?>>
                        <?php echo esc_html($case->humanName()); ?>
                    </option>
                <?php endforeach; ?>
            </select>
            <?php
        },
        'code-syntax-highlighting-block',
        'cshb_section_editor',
        ['label_for' => 'cshb_field_editor_indentation'],
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
    $options = get_option('cshb_options', []);
    assert(is_array($options));
    return CshbOptions::fromArray($options);
}

function cshb_settings_migrate(string $oldVersion): void {
    if (version_compare($oldVersion, '1.0.0', '<')) {
        add_option('cshb_options', [
            '__version' => 1,
            'theme_default' => 'atom-one-light',
            'theme_light_default' => '',
            'theme_dark_default' => '',
            'theme_favorites' => [
                'atom-one-dark',
                'atom-one-light',
            ],
            'language_default' => 'php',
            'language_favorites' => [
                'css',
                'html',
                'javascript',
                'php',
                'sql',
                'typescript',
            ],
        ]);
    }

    if (version_compare($oldVersion, '1.1.0', '<')) {
        $optionsArray = get_option('cshb_options', false);
        if (is_array($optionsArray)) {
            $optionsArray['__version'] = 2;
            $optionsArray['editor_indentation'] = '    ';
            update_option('cshb_options', $optionsArray);
        }
    }

    if (version_compare($oldVersion, '1.1.1', '<')) {
        $optionsArray = get_option('cshb_options', false);
        if (is_array($optionsArray)) {
            $optionsArray['__version'] = 3;
            $optionsArray['line_height'] = null;
            update_option('cshb_options', $optionsArray);
        }
    }
}

function cshb_settings_uninstall(): void
{
    delete_option('cshb_options');
}

final class CshbOptions
{
    private const VERSION = 3;

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
        public readonly ?CshbLineHeight $lineHeight,
        public readonly ?CshbEditorIndentation $editorIndentation,
    ) {
    }

    /**
     * @param array<mixed> $array 
     */
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

        $lineHeightRaw = $array['line_height'] ?? '';
        if (! is_string($lineHeightRaw)) {
            $lineHeightRaw = '';
        }
        $lineHeight = CshbLineHeight::tryFrom($lineHeightRaw);

        $editorIndentationRaw = $array['editor_indentation'] ?? '';
        if (! is_string($editorIndentationRaw)) {
            $editorIndentationRaw = '';
        }
        $editorIndentation = CshbEditorIndentation::tryFrom($editorIndentationRaw);
        
        return new self(
            $themeDefault,
            $themeLightDefault,
            $themeDarkDefault,
            $themeFavorites,
            $languageDefault,
            $languageFavorites,
            $lineHeight,
            $editorIndentation,
        );
    }

    /**
     * @return array<mixed>
     */
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
            'line_height' => $this->lineHeight?->value,
            'editor_indentation' => $this->editorIndentation?->value,
        ];
    }
}

enum CshbEditorIndentation : string {
    case SingleSpace = ' ';
    case TwoSpaces = '  ';
    case ThreeSpaces = '   ';
    case FourSpaces = '    ';
    case Tab = "\t";

    public function humanName(): string {
        return match($this) {
            self::SingleSpace => __('Single Space', 'code-syntax-highlighting-block'),
            self::TwoSpaces => __('Two Spaces', 'code-syntax-highlighting-block'),
            self::ThreeSpaces => __('Three Spaces', 'code-syntax-highlighting-block'),
            self::FourSpaces => __('Four Spaces', 'code-syntax-highlighting-block'),
            self::Tab => __('Tab', 'code-syntax-highlighting-block'),
        };
    }
}

enum CshbLineHeight: string {
    case LH1_0 = '1.0';
    case LH1_1 = '1.1';
    case LH1_2 = '1.2';
    case LH1_3 = '1.3';
    case LH1_4 = '1.4';
    case LH1_5 = '1.5';
    case LH1_6 = '1.6';
    case LH1_7 = '1.7';
    case LH1_8 = '1.8';
    case LH1_9 = '1.9';
    case LH2_0 = '2.0';
}