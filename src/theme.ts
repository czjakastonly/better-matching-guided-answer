import dsTheme from './ui/theme';
import { THEME } from './shims/stonlyCommons/global/index';

/** Mirrors the editor's theme composition (Site.js): const theme = { ...THEME, ...dsTheme }; */
export const theme = { ...THEME, ...dsTheme };

export type AppTheme = typeof theme;
