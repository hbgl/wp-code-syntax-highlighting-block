import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ComboboxControl } from '@wordpress/components';
import { useCallback, useEffect } from '@wordpress/element';
import hljs from 'highlight.js';
import { listThemes } from './lib/themes';
import { tryHighlightCode } from './lib/highlight';
import { getSettings } from './lib/settings';
import { CodemirrorEditor } from './lib/codemirror/CodemirrorEditor';

/**
 * @typedef {import('@wordpress/components/build-types/combobox-control/types').ComboboxControlOption} ComboboxControlOption
 */

/**
 * @type {{
 *     language: string|null,
 *     theme: string|null,
 *     themeLight: string|null,
 *     themeDark: string|null,
 * }}
 */
const rememberedSelections = {
    language: null,
    theme: null,
    themeLight: null,
    themeDark: null,
};

export default function Edit({ attributes, setAttributes }) {
    let code = attributes.code ?? '';
    let language = attributes.language ?? '';
    let theme = attributes.theme ?? '';
    let themeLight = attributes.themeLight ?? '';
    let themeDark = attributes.themeDark ?? '';

    const isNewBlock = language === '';
    if (isNewBlock) {
        const settings = getSettings();
        language ||= rememberedSelections.language || settings.languageDefault;
        theme ||= rememberedSelections.theme || settings.themeDefault;
        themeLight ||= rememberedSelections.themeLight || settings.themeDefaultLight;
        themeDark ||= rememberedSelections.themeDark || settings.themeDefaultDark;
    }

    useEffect(() => {
        if (isNewBlock) {
            setAttributes({
                language,
                theme,
                themeLight,
                themeDark,
            });
        }
    }, []);

    const onCodeChange = useCallback(value => {
        setAttributes({
            code: value,
            codeHighlightedHtml: tryHighlightCode(value, language),
        });
    }, [language]);

    const onLanguageChange = useCallback(value => {
        rememberedSelections.language = value || null;
        setAttributes({
            language: value,
            codeHighlightedHtml: tryHighlightCode(code, value),
        });
    }, [code]);

    const onThemeChange = useCallback(value => {
        rememberedSelections.theme = value || null;
        setAttributes({ theme: value });
    }, []);

    const onThemeLightChange = useCallback(value => {
        rememberedSelections.themeLight = value || null;
        setAttributes({ themeLight: value });
    }, []);

    const onThemeDarkChange = useCallback(value => {
        rememberedSelections.themeDark = value || null;
        setAttributes({ themeDark: value });
    }, []);

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Settings', 'code-syntax-highlighting-block')}>
                    <ComboboxControl
                        label={__('Language', 'code-syntax-highlighting-block')}
                        value={language}
                        options={getLanguageOptions()}
                        onChange={onLanguageChange}
                        allowReset={false}
                    />
                    <ComboboxControl
                        label={__('Theme', 'code-syntax-highlighting-block')}
                        value={theme}
                        options={getThemeOptions()}
                        onChange={onThemeChange}
                        allowReset={false}
                    />
                    <ComboboxControl
                        label={__('Theme Override (light)', 'code-syntax-highlighting-block')}
                        value={themeLight}
                        options={getThemeOverrideOptions()}
                        onChange={onThemeLightChange}
                        allowReset={true}
                    />
                    <ComboboxControl
                        label={__('Theme Override (dark)', 'code-syntax-highlighting-block')}
                        value={themeDark}
                        options={getThemeOverrideOptions()}
                        onChange={onThemeDarkChange}
                        allowReset={true}
                    />
                </PanelBody>
            </InspectorControls>

            <CodemirrorEditor
                initialCode={code}
                language={language}
                onChange={onCodeChange}
            />
        </div>
    );
}

/** @type {ComboboxControlOption[]} */
let languageOptions = null;

/**
 * @return {ComboboxControlOption[]}
 */
function getLanguageOptions() {
    if (languageOptions === null) {
        languageOptions = buildOptionsWithFavorites(
            hljs.listLanguages().map(l => ({label: l, value: l})),
            getSettings().languageFavorites,
        );
    }

    return languageOptions;
}

/** @type {ComboboxControlOption[]} */
let themeOptions = null;

/**
 * @returns {ComboboxControlOption[]}
 */
function getThemeOptions() {
    if (themeOptions === null) {
        themeOptions = buildOptionsWithFavorites(
            listThemes().map(t => ({ label: t.name, value: t.name })),
            getSettings().themeFavorites,
        );
    }

    return themeOptions;
}

/** @type {import('@wordpress/components/build-types/combobox-control/types').ComboboxControlOption[]} */
let themeOverrideOptions = null;

/**
 * @returns {ComboboxControlOption[]}
 */
function getThemeOverrideOptions() {
    if (themeOverrideOptions === null) {
        themeOverrideOptions = [
            { label: '', value: '' },
            ...getThemeOptions(),
        ];
    }

    return themeOverrideOptions;
}

/**
 * @param {ComboboxControlOption[]} options 
 * @param {string[]} favorites 
 * @return {ComboboxControlOption[]}
 */
function buildOptionsWithFavorites(options, favorites) {
    const favoritesLookup = new Set(favorites);
    const favoriteOptions = [];
    const restOptions = [];
    for (const option of options) {
        if (favoritesLookup.has(option.value)) {
            favoriteOptions.push(option);
        } else {
            restOptions.push(option);
        }
    }

    const result = [];
    result.push(...favoriteOptions);
    if (favoriteOptions.length > 0 && restOptions.length > 0) {
        result.push({ label: '╍╍╍', value: '__favorites__divider__', disabled: true });
    }
    result.push(...restOptions);

    return result;
}