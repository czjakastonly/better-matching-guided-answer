import React from 'react';
import { useTranslation } from 'react-i18next';
import { AI_SOURCE_STATUS, AI_SOURCE } from 'stonly-editor/model/aiSource/aiSource.enum';
import { ButtonMinimal } from '@ui/components/buttons/ButtonMinimal';
import { withListBox, withListBoxOption } from '@ui/components/ListBox';
import { List, ListBody, ListDivider, ListItemDelete, ListItemStandard } from '@ui/components/List';
import { useFloatingDropdown } from '@ui/components/Dropdown';
import MoreSVG from 'icons/more.svg';
import { Popover } from '@ui/components/Popover';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import EditSVG from '@ui/atoms/icons/Edit-16.svg';
import ToggleSVG from '@ui/atoms/icons/Toggle-16.svg';
import TipSVG from '@ui/atoms/icons/Tip-16.svg';
import PlusSVG from '@ui/atoms/icons/Plus-16.svg';
import { MenuColumn } from '../../aiSources.styles';
import { getTranslationMainKey } from '../../../../helpers/i18n.helper';

const ListBox = withListBox(List);
const Option = withListBoxOption(ListItemStandard);
const OptionDelete = withListBoxOption(ListItemDelete);

interface SourceMenuColumnProps {
  source: AiSourceModel.AiSource;
  toggleSource: (source: AiSourceModel.AiSource) => void;
  removeSource: (source: AiSourceModel.AiSource) => void;
  editSource: (source: AiSourceModel.AiSource) => void;
  viewDetails?: (source: AiSourceModel.AiSource) => void;
  viewUsedIn?: (source: AiSourceModel.AiSource) => void;
  addElements?: (source: AiSourceModel.AiSource) => void;
}

const SourceMenuColumn = ({
  source,
  toggleSource,
  removeSource,
  editSource,
  viewDetails,
  viewUsedIn,
  addElements,
}: SourceMenuColumnProps): JSX.Element => {
  const { t } = useTranslation();
  const translationMainKey = getTranslationMainKey(source.type);

  const { isOpen, close, triggerProps, floatingProps } = useFloatingDropdown({
    closingKeyList: ['Escape'],
    maxWidthRatio: 12,
  });
  const isToggleDisabled =
    (source.type !== AI_SOURCE.pdfGroup && source.status !== AI_SOURCE_STATUS.COMPLETED) ||
    (source.type === AI_SOURCE.pdfGroup && !source.elementsCount);

  return (
    <MenuColumn data-cy="sourceOptions" className={isOpen ? undefined : 'icon-show'} onClick={e => e.stopPropagation()}>
      <ButtonMinimal iconOnly={<MoreSVG />} size="small" {...triggerProps} />
      {isOpen && (
        <Popover {...floatingProps}>
          <ListBox onPostAction={close} autoFocus onClick={e => e.stopPropagation()}>
            <ListBody>
              <Option
                key="edit"
                action={() => editSource(source)}
                label={t(`${translationMainKey}Edit`)}
                iconLeft={<EditSVG />}
              />
              <Option
                key="enable"
                action={() => toggleSource(source)}
                label={t(`AiSources.${source.enabled ? 'Disable' : 'Enable'}`)}
                disabled={isToggleDisabled}
                iconLeft={<ToggleSVG />}
              />
              {!!viewDetails && (
                <Option
                  key="details"
                  action={() => viewDetails(source)}
                  label={t(`AiSources.ViewDetails`)}
                  iconLeft={<TipSVG />}
                />
              )}
              {!!viewUsedIn && (
                <Option
                  key="details"
                  action={() => viewUsedIn(source)}
                  label={t(`AiSources.IsUsedIn`)}
                  iconLeft={<TipSVG />}
                />
              )}
              {!!addElements && (
                <Option
                  key="addElements"
                  action={() => addElements(source)}
                  label={t(`${translationMainKey}AddElements`) || undefined}
                  iconLeft={<PlusSVG />}
                />
              )}
              <ListDivider />
              <OptionDelete key="delete" action={() => removeSource(source)} label={t('AiSources.Delete')} />
            </ListBody>
          </ListBox>
        </Popover>
      )}
    </MenuColumn>
  );
};

export default SourceMenuColumn;
