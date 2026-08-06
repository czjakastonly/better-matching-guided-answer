import React from 'react';

import type { theme as DSTheme } from '@ui/theme';
import Tick16 from '@ui/atoms/icons/Tick-16.svg';
import Tip16 from '@ui/atoms/icons/Tip-16.svg';
import Warning16 from '@ui/atoms/icons/Warning-16.svg';
import Error16 from '@ui/atoms/icons/Error-16.svg';
import Tick24 from '@ui/atoms/icons/Tick-24.svg';
import Tip24 from '@ui/atoms/icons/Tip-24.svg';
import Warning24 from '@ui/atoms/icons/Warning-24.svg';
import Error24 from '@ui/atoms/icons/Error-24.svg';
import type { Status } from '@ui/models';
import { STATIC_CLASS_NAME } from '@ui/constants';

export const STATUS_ICON_CLASS_NAME = 'ston-status-icon';

export const resolveMainColorForStatus = (theme: typeof DSTheme, status?: Status | false) => {
  if (status === 'error') {
    return theme.color.backgroundDanger;
  }
  if (status === 'success') {
    return theme.color.backgroundGreenDefault;
  }
  if (status === 'warning') {
    return theme.color.backgroundYellowDefault;
  }
  if (status === 'info') {
    return theme.color.backgroundBlueDefault;
  }

  return undefined;
};

export const resolveBackColorForStatus = (theme: typeof DSTheme, status?: Status | false) => {
  if (status === 'error') {
    return theme.color.backgroundDangerSubtle;
  }
  if (status === 'success') {
    return theme.color.backgroundGreenSubtlest;
  }
  if (status === 'warning') {
    return theme.color.backgroundWarningSubtle;
  }
  if (status === 'info') {
    return theme.color.backgroundBlueSubtlest;
  }

  return undefined;
};

export const renderStatusIconForStatus = (status?: Status | false, iconSizeName?: '16' | '24') => {
  if (status === 'error') {
    const Error = iconSizeName === '24' ? Error24 : Error16;
    return <Error data-status={status} className={STATIC_CLASS_NAME.statusIcon} />;
  }
  if (status === 'warning') {
    const Warning = iconSizeName === '24' ? Warning24 : Warning16;
    return <Warning data-status={status} className={STATIC_CLASS_NAME.statusIcon} />;
  }
  if (status === 'success') {
    const Tick = iconSizeName === '24' ? Tick24 : Tick16;
    return <Tick data-status={status} className={STATIC_CLASS_NAME.statusIcon} />;
  }
  if (status === 'info') {
    const Tip = iconSizeName === '24' ? Tip24 : Tip16;
    return <Tip data-status={status} className={STATIC_CLASS_NAME.statusIcon} />;
  }

  return null;
};
