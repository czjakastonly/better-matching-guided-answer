import type { theme as DSTheme } from '@ui/theme';
import type { Status } from '@ui/models';
import { renderStatusIconForStatus } from '@ui/utils/status.helpers';

export const resolveIconColorForInputStatus = (theme: typeof DSTheme, status?: Status | false) => {
  if (status === 'error') {
    return theme.color.iconDanger;
  }
  if (status === 'success') {
    return theme.color.iconSuccess;
  }
  if (status === 'warning') {
    return theme.color.iconWarning;
  }

  return undefined;
};

export const resolveMessageColorForInputStatus = (theme: typeof DSTheme, status?: Status | false) => {
  if (status === 'error') {
    return theme.color.textDanger;
  }
  if (status === 'success') {
    return theme.color.textSuccess;
  }
  if (status === 'warning') {
    return theme.color.textWarning;
  }
  if (status === 'info') {
    return theme.color.textSubtle;
  }

  return undefined;
};

export const resolveBorderColorForInputStatus = (theme: typeof DSTheme, status?: Status | false) => {
  if (status === 'error') {
    return theme.color.borderDanger;
  }
  if (status === 'success') {
    return theme.color.borderSuccess;
  }
  if (status === 'warning') {
    return theme.color.textWarning;
  }

  return undefined;
};

export const renderStatusIconForInputStatus = (status?: Status | false, iconSizeName?: '16' | '24') => {
  if (status === 'success') {
    return renderStatusIconForStatus(status, iconSizeName);
  }
  return null;
};

export const renderMessageStatusIconForInputStatus = (status?: Status | false, iconSizeName?: '16' | '24') => {
  if (status === 'success') {
    return null;
  }
  if (status === 'info') {
    return null;
  }
  return renderStatusIconForStatus(status, iconSizeName);
};
