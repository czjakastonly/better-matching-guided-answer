import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CheckCircleSVG from '@ui/atoms/icons/CheckCircle-16.svg';
import { Option, SelectMultiple } from '@ui/components/Select';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  min-width: 160px;
`;

const PlaceholderIcon = styled(CheckCircleSVG)`
  path {
    fill: ${props => props.theme.color.iconSubtle};
  }
`;

const SelectedIcon = styled(CheckCircleSVG)`
  path {
    fill: ${props => props.theme.color.iconActive};
  }
`;

const SettingPicker = ({
  selectedOptions,
  setSelectedOptions,
  defaultLabel,
  disabled,
  dataCy,
  options,
  placeholderIcon = <PlaceholderIcon />,
  selectedIcon = <SelectedIcon />,
}) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <SelectMultiple
        data-cy={dataCy}
        labelApply={t('Global.Apply')}
        labelCancel={t('Global.Cancel')}
        maxWidthRatio={2}
        valueList={selectedOptions}
        onChangeValueList={setSelectedOptions}
        disabled={disabled}
        renderIconLeft={() => (selectedOptions.length ? selectedIcon : placeholderIcon)}
        renderLabel={payloadList =>
          payloadList.length ? payloadList.map(payload => payload.label).join(', ') : defaultLabel
        }
      >
        {options.map(option => (
          <Option key={option.value} label={option.label} value={option.value} iconLeft={option.iconLeft} />
        ))}
      </SelectMultiple>
    </Wrapper>
  );
};

SettingPicker.propTypes = {
  selectedOptions: PropTypes.array,
  setSelectedOptions: PropTypes.func,
  defaultLabel: PropTypes.string,
  disabled: PropTypes.bool,
  dataCy: PropTypes.string,
  placeholderIcon: PropTypes.node,
  selectedIcon: PropTypes.node,
};

export default SettingPicker;
