import hljs from 'highlight.js';

/**
 * @param {string} code 
 * @param {string} language 
 * @returns {string}
 */
export function tryHighlightCode(code, language) {
    try {
        const result = hljs.highlight(code, {
            language: language,
            ignoreIllegals: true,
        });
        return result.value;
    } catch {
        return '';
    }
}