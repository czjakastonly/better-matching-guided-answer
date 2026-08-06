import { color } from './atoms/colors';
import { typography } from './atoms/typography';
import { shadows } from './atoms/shadows';
import { scrollbars } from './atoms/scrollbars';
import { zIndex } from './atoms/zIndex';

export const theme = {
  color,
  typography,
  shadows,
  scrollbars,
  zIndex,
} as const;

export default theme;
