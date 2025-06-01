import { useBlockProps } from '@wordpress/block-editor';
import { getTheme } from './lib/themes';

const stylesheetBaseDir = '/wp-content/plugins/code-syntax-highlighting-block/public/css/themes/';

export default function save({ attributes }) {
    const {
        codeHighlightedHtml,
        theme,
        themeLight,
        themeDark,
    } = attributes;

    const themeStylesheets = buildThemeStylesheets(theme, themeLight, themeDark);

    return (
        <div { ...useBlockProps.save() }>
            <template shadowrootmode="open">
                {themeStylesheets}
                <pre><code class="hljs" dangerouslySetInnerHTML={{ __html: codeHighlightedHtml}} /></pre>
            </template>
        </div>
    );
}

/**
 * @param {string} theme 
 * @param {string} themeLight 
 * @param {string} themeDark 
 * @returns {JSX.Element[]}
 */
function buildThemeStylesheets(theme, themeLight, themeDark) {
    const themeStylesheets = [];
    if (themeLight === '' || themeDark === '') {
        let media = undefined;
        if (themeLight !== '') {
            media = '(prefers-color-scheme: dark)';
        }
        if (themeDark !== '') {
            media = '(prefers-color-scheme: light)';
        }
        const themeInfo = getTheme(theme);
        if (themeInfo) {
            themeStylesheets.push(
                <link
                    key="default"
                    rel="stylesheet"
                    href={`${stylesheetBaseDir}${themeInfo.stylesheetFileName}?i=${encodeURIComponent(themeInfo.stylesheetContentHash)}`}
                    media={media}
                ></link>
            );
        }
    }
    if (themeLight !== '') {
        const themeLightInfo = getTheme(themeLight);
        if (themeLightInfo) {
            themeStylesheets.push(
                <link
                    key="light"
                    rel="stylesheet"
                    href={`${stylesheetBaseDir}${themeLightInfo.stylesheetFileName}?i=${encodeURIComponent(themeLightInfo.stylesheetContentHash)}`}
                    media="(prefers-color-scheme: light)"
                ></link>
            );
        }
    }

    if (themeDark !== '') {
        const themeDarkInfo = getTheme(themeDark);
        if (themeDarkInfo) {
            themeStylesheets.push(
                <link
                    key="dark"
                    rel="stylesheet"
                    href={`${stylesheetBaseDir}${themeDarkInfo.stylesheetFileName}?i=${encodeURIComponent(themeDarkInfo.stylesheetContentHash)}`}
                    media="(prefers-color-scheme: dark)"
                ></link>
            );
        }
    }

    return themeStylesheets;
}