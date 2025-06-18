import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { debounce } from '@wordpress/compose';

import { EditorView } from 'codemirror';
import {
    keymap, highlightSpecialChars, drawSelection, highlightActiveLine,
    dropCursor, highlightActiveLineGutter, ViewPlugin
} from "@codemirror/view"
import { Compartment } from "@codemirror/state"
import {
    defaultHighlightStyle, syntaxHighlighting, indentOnInput, bracketMatching,
    foldKeymap, indentUnit
} from "@codemirror/language"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"

import { createLanguageExtension } from './languages';
import { getSettings } from '../settings';

export function CodemirrorEditor({
    initialCode,
    language,
    onChange,
}) {
    const hostRef = useRef(null);
    const viewRef = useRef(null);
    const languageCompartmentRef = useRef(null);
    const languageAppliedRef = useRef(null);

    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        const host = hostRef.current;

        if (!host) {
            return;
        }

        let canceled = false;
        let initialized = false;
        let container = null;
        let view = null;
        let onEditorDocChange = null;

        (async () => {
            const languageExtension = await tryCreateLanguageExtension(language);

            if (canceled) {
                return;
            }

            container = document.createElement('div');
            container.addEventListener('keydown', (e) => {
                // Do not propagate CTRL + A to gutenberg.
                if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                    e.stopPropagation();
                }
            }, true);

            const shadow = container.attachShadow({ mode: "open" });

            const style = document.createElement('style');
            style.textContent = getEditorStyle();
            shadow.append(style);

            host.append(container);

            const docChangeThrottleMs = 1000;
            const docChangeMaxWaitMs = 5000;
            onEditorDocChange = debounce(() => {
                const view = viewRef.current;
                const onChange = onChangeRef.current;
                if (view && onChange) {
                    onChange(view.state.doc.toString());
                }
            }, docChangeThrottleMs, { maxWait: docChangeMaxWaitMs });

            const languageCompartment = new Compartment();
            languageCompartmentRef.current = languageCompartment;

            view = new EditorView({
                doc: initialCode,
                extensions: [
                    highlightActiveLineGutter(),
                    highlightSpecialChars(),
                    history(),
                    drawSelection(),
                    dropCursor(),
                    indentOnInput(),
                    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                    bracketMatching(),
                    closeBrackets(),
                    highlightActiveLine(),
                    highlightSelectionMatches(),
                    indentUnit.of(getSettings().editorIndentation),
                    keymap.of([
                        ...closeBracketsKeymap,
                        ...defaultKeymap,
                        ...searchKeymap,
                        ...historyKeymap,
                        ...foldKeymap,
                        ...lintKeymap,
                        indentWithTab,
                    ]),
                    languageCompartment.of(languageExtension),
                    ViewPlugin.fromClass(class {
                        constructor(view) {
                            this.dom = view.dom;
                            this.handleBlur = () => {
                                onEditorDocChange.flush();
                            };
                            this.dom.addEventListener('blur', this.handleBlur, true);
                        }

                        destroy() {
                            this.dom.removeEventListener('blur', this.handleBlur, true);
                        }

                        update(update) {
                            if (update.docChanged) {
                                onEditorDocChange();
                            }
                        }
                    }),
                ],
                parent: shadow,
            });

            viewRef.current = view;
            languageAppliedRef.current = language;

            initialized = true;
        })();

        return () => {
            canceled = true;
            if (initialized) {
                if (onEditorDocChange) {
                    onEditorDocChange.cancel();
                }

                if (view) {
                    view.destroy();
                    viewRef.current = null;
                }

                if (container) {
                    container.remove();
                }

                languageAppliedRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const view = viewRef.current;
        const languageCompartment = languageCompartmentRef.current;

        if (!view || !languageCompartment) {
            return;
        }

        if (languageAppliedRef === language) {
            return;
        }

        let canceled = false;

        (async () => {
            const languageExtension = await tryCreateLanguageExtension(language);
            if (canceled) {
                return;
            }
            view.dispatch({
                effects: languageCompartment.reconfigure(languageExtension),
            });
            languageAppliedRef.current = language;
        })();

        return () => {
            canceled = true;
        };
    }, [language]);

    return <div ref={hostRef} />;
}

function getEditorStyle() {
    return `
        .cm-editor.cm-editor {
            padding: 9px 11px;
            box-shadow: transparent 0px 0px 0px;
            border-radius: 2px;
            border: 1px solid var(--wp-components-color-gray-600, #949494);
        }
        .cm-editor.cm-editor.cm-focused {
            border-color: var(--wp-components-color-accent, var(--wp-admin-theme-color, #3858e9));
            box-shadow: 0 0 0 calc(1.5px - 1px) var(--wp-components-color-accent, var(--wp-admin-theme-color, #3858e9));
            outline: transparent solid 2px;
        }
    `;
}

/**
 * @param {string} language 
 * @returns {Promise<import('highlight.js').Language|[]>}
 */
async function tryCreateLanguageExtension(language) {
    try {
        return (await createLanguageExtension(language)) ?? [];
    } catch {
    }

    return [];
}
