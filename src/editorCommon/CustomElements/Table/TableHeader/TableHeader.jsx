import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { PAGINATION_LIMIT } from 'global';
import i18n from 'helpers/i18n';

import ChevronRightSVG from 'resources/icons/chevronRight.svg';
import ChevronLeftSVG from 'resources/icons/chevronLeft.svg';

import {
  PaginationIndexes,
  PaginationArrows,
  ArrowButton,
  Search,
  SearchInput,
  SearchInputIcon,
  SearchCrossIcon,
} from '@editorCommon/CommonStyledComponents/SettingsStyles';
import { ButtonAdd } from '@ui/components/buttons/ButtonAdd';

const Canvas = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 20px 24px 20px 32px;
  margin: 0 -32px;
  border-bottom: 1px solid ${props => props.theme.silver};
  background: ${props => props.theme.white};
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

const TableHeader = ({
  className,
  itemsCount,
  addText,
  onAddItemClick,
  addItemDataCy,
  page,
  changePage,
  existsNext,
  searchString,
  searchPlaceholder,
  onSearchStringChange,
  customAddButton,
  paginationLimit = PAGINATION_LIMIT,
}) => {
  const paginationIndexes = `${itemsCount === 0 ? 0 : (page - 1) * paginationLimit + 1}-${Math.min(
    itemsCount,
    paginationLimit * page
  )} ${i18n('AdminConsole.MembersOf')} ${itemsCount}`;

  return (
    <Canvas className={className}>
      {customAddButton || null}
      {onAddItemClick && (
        <ButtonAdd data-cy={addItemDataCy} onClick={onAddItemClick}>
          {addText}
        </ButtonAdd>
      )}
      <PaginationIndexes>{paginationIndexes}</PaginationIndexes>
      <PaginationArrows>
        <ArrowButton
          background="white"
          mouseover="grey"
          type="smallIcon"
          content={ChevronLeftSVG}
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
        />
        <ArrowButton
          background="white"
          mouseover="grey"
          type="smallIcon"
          content={ChevronRightSVG}
          onClick={() => changePage(page + 1)}
          disabled={!existsNext}
        />
      </PaginationArrows>
      {typeof onSearchStringChange === 'function' && (
        <Search>
          <SearchInputIcon />
          <SearchInput
            data-cy="SearchInput"
            placeholder={searchPlaceholder}
            value={searchString}
            onChange={onSearchStringChange}
          />
          <SearchCrossIcon show={searchString} onClick={onSearchStringChange} />
        </Search>
      )}
    </Canvas>
  );
};

TableHeader.propTypes = {
  className: PropTypes.string,
  itemsCount: PropTypes.number,
  addText: PropTypes.string,
  onAddItemClick: PropTypes.func,
  addItemDataCy: PropTypes.string,
  page: PropTypes.number,
  changePage: PropTypes.func,
  existsNext: PropTypes.bool,
  searchString: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  onSearchStringChange: PropTypes.func,
  customAddButton: PropTypes.node,
  paginationLimit: PropTypes.number,
};

export default TableHeader;
