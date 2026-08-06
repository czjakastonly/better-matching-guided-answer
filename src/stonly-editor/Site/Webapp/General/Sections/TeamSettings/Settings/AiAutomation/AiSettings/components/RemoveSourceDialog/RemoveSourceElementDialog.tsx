import React from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnFlex } from '@ui/components/Flex';
import { ModalWindow } from '@ui/components/ModalWindow';
import { WarningDialog } from '@ui/components/dialogs/WarningDialog';
import DeleteSVG from '@ui/atoms/icons/Delete-24.svg';
import { escapeHTML } from '@stonlyCommons/helpers/sanitizeHelpers';
import { type AiSourceType } from 'stonly-editor/model/aiSource/aiSource.enum';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import { getTranslationMainKey } from '../../helpers/i18n.helper';
import { RemoveSourceElementInUsageDialog } from './RemoveSourceElementInUsageDialog';

export interface RemoveSourceElementDialogProps {
  sourceElement: AiSourceModel.AiSourceElement;
  type: AiSourceType;
  onClose: () => void;
  onDelete: () => void;
  teamId: number;
}

const RemoveSourceElementDialog = ({
  sourceElement,
  type,
  onClose,
  onDelete,
  teamId,
}: RemoveSourceElementDialogProps) => {
  const { searchSourceElementId, name, usedIn } = sourceElement;
  const { t } = useTranslation();
  const translationMainKey = getTranslationMainKey(type, true);

  const onDeleteProxy = () => {
    onDelete();
    onClose();
  };

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
          </ColumnFlex>
        </WarningDialog>
      )}
      {!!usedIn && searchSourceElementId && (
        <RemoveSourceElementInUsageDialog
          sourceElement={sourceElement}
          type={type}
          teamId={teamId}
          onDelete={onDelete}
          onClose={onClose}
        />
      )}
    </ModalWindow>
  );
};

export default RemoveSourceElementDialog;
