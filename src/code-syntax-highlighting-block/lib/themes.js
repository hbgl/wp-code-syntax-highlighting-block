import { themes } from "../generated/theme-manifest.generated";

export function listThemes() {
    return Object.values(themes);
}

/**
 * 
 * @param {string} name 
 */
export function getTheme(name) {
    return themes[name] ?? null;
}