import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnFlex } from '@ui/components/Flex';
import { ModalWindow } from '@ui/components/ModalWindow';
import { WarningDialog } from '@ui/components/dialogs/WarningDialog';
import DeleteSVG from '@ui/atoms/icons/Delete-24.svg';
import { escapeHTML } from '@stonlyCommons/helpers/sanitizeHelpers';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import { getTranslationMainKey } from '../../helpers/i18n.helper';
import { RemoveSourceInUsageDialog } from './RemoveSourceInUsageDialog';
import { getSourceUrl } from '../../helpers/source.helper';
import { TextWithLink } from './RemoveSourceDialog.styles';

export interface RemoveSourceDialogProps {
  source: AiSourceModel.AiSource;
  onClose: () => void;
  onDelete: () => void;
  teamId: number;
}

const RemoveSourceDialog = ({ source, onClose, onDelete, teamId }: RemoveSourceDialogProps) => {
  const { usedIn, url, type, name } = source;
  const { t } = useTranslation();
  const translationMainKey = getTranslationMainKey(type);

  const onDeleteProxy = () => {
    onDelete();
    onClose();
  };

  const sourceUrl = getSourceUrl({ url, type });

  return (
    <ModalWindow>
      {!usedIn && (
        <WarningDialog
          data-cy="deleteSourceDialog"
          title={t(`${translationMainKey}DeletePopupTitle`)}
          primaryAction={onDeleteProxy}
          primaryLabel={t('Global.Delete')}
          secondaryAction={onClose}
          secondaryLabel={t('Global.Cancel')}
          autoFocusMode="secondary"
          severity="error"
          size="small"
          titleIcon={<DeleteSVG />}
        >
          <ColumnFlex justifyContent="center" alignItems="center" gap={3}>
            <span style={{ wordBreak: 'break-word' }}>
              {t(`${translationMainKey}DeletePopupContent`, { sourceName: escapeHTML(name) })}
            </span>
            {!!sourceUrl && <TextWithLink>{t(`${translationMainKey}SourceUrl`, { sourceUrl })}</TextWithLink>}
          </ColumnFlex>
        </WarningDialog>
      )}
      {!!usedIn && (
        <RemoveSourceInUsageDialog source={source} teamId={teamId} onDelete={onDeleteProxy} onClose={onClose} />
      )}
    </ModalWindow>
  );
};

export default RemoveSourceDialog;
