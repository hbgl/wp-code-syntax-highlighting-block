/**
 * @typedef {Object} Settings
 * @property {string} languageDefault
 * @property {string[]} languageFavorites
 * @property {string} themeDefault
 * @property {string} themeDefaultLight
 * @property {string} themeDefaultDark
 * @property {string[]} themeFavorites
 */

/** @type {Object} */
const settingsRaw = window['code-syntax-highlighting-block-options'] ?? {};

/** @type {Readonly<Settings>} */
const settings = Object.freeze({
    languageDefault: settingsRaw.language_default || 'plaintext',
    languageFavorites: settingsRaw.language_favorites ?? [],
    themeDefault: settingsRaw.theme_default || 'default',
    themeDefaultLight: settingsRaw.theme_dark_default ?? '',
    themeDefaultDark: settingsRaw.theme_dark_default ?? '',
    themeFavorites: settingsRaw.theme_favorites ?? [],
});

export function getSettings() {
    return settings;
}
