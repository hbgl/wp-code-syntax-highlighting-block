import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, TextareaControl } from '@wordpress/components';
import { useEffect, useMemo } from '@wordpress/element';
import hljs from 'highlight.js';
import useDebouncedInputCustom from './lib/debounce';
import { listThemes } from './lib/themes';
import { tryHighlightCode } from './lib/highlight';

export default function Edit({ attributes, setAttributes }) {
    const {
        code,
        language,
        theme,
        themeLight,
        themeDark,
    } = attributes;

    const [codeImmediateValue, setCodeDebouncedValue, codeDebouncedValue] = useDebouncedInputCustom(code, 1000);

    useEffect(() => {
        setAttributes({
            code: codeDebouncedValue,
            codeHighlightedHtml: tryHighlightCode(codeDebouncedValue, language),
        });
    }, [codeDebouncedValue]);

    const onLanguagechange = (value) => {
        setAttributes({
            language: value,
            codeHighlightedHtml: tryHighlightCode(codeDebouncedValue, value),
        });
    };

    const languageOptions = useMemo(
        () => hljs.listLanguages().map(l => ({ label: l, value: l})),
        [],
    );
    const themeOptions = useMemo(
        () => listThemes().map(t => ({ label: t.name, value: t.name})),
        [],
    );
    const themeOverrideOptions = useMemo(
        () => [{ label: '', value: '' }, ...themeOptions],
        [],
    );

    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody title={__('Settings', 'code-syntax-highlighting-block')}>
                    <SelectControl
                        label={__('Language', 'code-syntax-highlighting-block')}
                        value={language}
                        options={languageOptions}
                        onChange={(value) => onLanguagechange(value)}
                    />
                    <SelectControl
                        label={__('Theme', 'code-syntax-highlighting-block')}
                        value={theme}
                        options={themeOptions}
                        onChange={(value) => setAttributes({ theme: value })}
                    />
                    <SelectControl
                        label={__('Theme Override (light)', 'code-syntax-highlighting-block')}
                        value={themeLight}
                        options={themeOverrideOptions}
                        onChange={(value) => setAttributes({ themeLight: value })}
                    />
                    <SelectControl
                        label={__('Theme Override (dark)', 'code-syntax-highlighting-block')}
                        value={themeDark}
                        options={themeOverrideOptions}
                        onChange={(value) => setAttributes({ themeDark: value })}
                    />
                </PanelBody>
            </InspectorControls>
            <TextareaControl
                rows="8"
                value={codeImmediateValue}
                onChange={(value) => setCodeDebouncedValue(value)}
            />
        </div>
    );
}
