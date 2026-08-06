import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import ArrowIconSVG from '@editorCommon/resources/icons/arrowUpSmall.svg';
import { StyledLoader } from '@editorCommon/CommonStyledComponents/SettingsStyles';
import { useTranslation } from 'react-i18next';

const ArrowIcon = styled(ArrowIconSVG)`
  ${({ sort }) =>
    sort === 'desc' &&
    css`
      transform: rotate(180deg);
    `};

  margin-left: 6px;
  flex-shrink: 0;

  path {
    fill: ${props => props.theme.steel};
  }
`;

const ArrowIconContainer = styled.div`
  display: inline-flex;
  align-items: center;
  width: 6px;
  margin-right: -6px;
  vertical-align: middle;
`;

const TableHeadActionContainer = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  transition: opacity 0.2s;
  opacity: 0;
  text-transform: initial;
  z-index: 1;
`;

const TableMain = styled.table`
  width: calc(100% + 16px);
  text-align: left;
  border-collapse: collapse;
  margin-left: -8px;
  margin-right: -8px;
`;

const TableHeadCellFlex = styled.div`
  /* display: flex;
  flex-direction: row; */
`;

const TableHeadCellText = styled.div`
  display: inline-block;
  max-width: calc(100% - 6px);
  vertical-align: middle;
  user-select: none;

  ${({ sortable }) =>
    sortable &&
    css`
      cursor: pointer;
    `}
`;

const TableHeadCell = styled.th`
  position: relative;
  ${({ theme }) => theme.typography.uiElementLabel}
  padding: 16px 8px;

  &:first-child {
    padding-left: 8px;
  }
  &:last-child {
    padding-right: 8px;
  }

  &:hover {
    ${TableHeadActionContainer} {
      opacity: 1;
    }
  }
`;

export const TableBody = styled.tbody`
  color: ${props => props.theme.darkGrey};
  font-size: 16px;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.silver};
  transition: background-color 0.2s;
  transition: opacity 0.2s;

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;
    `}

  & .with-table-show-on-focus {
    opacity: 0;
  }

  &:hover .icon-hide {
    opacity: 0;
  }
  &:focus-within .with-table-show-on-focus,
  & *[aria-expanded='true'],
  &:hover .icon-show {
    opacity: 1;
  }
`;

const TableCell = styled.td`
  padding: 16px 8px;

  &:first-child {
    padding-left: 8px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &:last-child {
    padding-right: 8px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const TableHead = styled.thead`
  color: ${props => props.theme.steel};
  text-transform: uppercase;
  font-size: 12px;

  ${TableRow} {
    &:hover {
      background-color: inherit;
    }
  }
`;

const TableWrap = styled.div`
  width: 100%;

  ${({ borderless }) =>
    borderless &&
    css`
      ${TableRow} {
        border-bottom: 0;

        &:hover {
          background-color: ${props => props.theme.paleGrey};
        }
      }
      ${TableHead} {
        ${TableRow} {
          &:hover {
            background-color: inherit;
          }
        }
      }
    `}

  ${({ scrollable }) =>
    scrollable &&
    css`
      ${TableMain} {
        table-layout: fixed;
        margin-left: 0;
        margin-right: 0;
        width: 100%;
      }
      ${TableHead} {
        background: white;
      }
      ${TableHead} ${TableHeadCell} {
        position: sticky;
        top: 0;
        background: white;
        z-index: 1;
      }
      overflow-x: auto;
    `}
`;

/**
 * @callback cellFormatter
 * @param {Row} row - row of a table
 * @param {number} rindex - row index
 * @param {Row[]} allRows - all rows in a table
 * @returns {JSX.Element}
 */

/**
 * @typedef {Object} Column - Column header cell of a table
 * @prop {string} name - column header text
 * @prop {boolean} [sortable] - is column sortable (optional)
 * @prop {string} [sortField] - key of Row for sorting (optional)
 * @prop {cellFormatter} cellFormatter - function for rendering a table cell
 * @prop {Object} [style] - header cell CSS styles (optional)
 */

/**
 * @typedef {{[key: string]: any}} Row - Row of a table
 * @prop {string} [__rowClassName] - class name for a table cell. (optional)
 */

/**
 * @callback CustomSort
 * @param {Column['sortField']} sortField - sort by field coming from Column
 * @param {'asc' | 'desc'} sortDirection - ascending or descending sort direction
 */

/**
 * Table component
 * @param {Object} props - table component properties
 * @param {Column[]} props.columns - header cells of a table
 * @param {Row[]} props.rows - rows of a table
 * @param {boolean} props.borderless - should a table have a border
 * @param {boolean} props.scrollable - should a table be scrollable
 * @param {string} props.className - class name for a table container
 * @param {CustomSort} [props.customSort] - optional custom sort callback
 * @param {'asc' | 'desc'} [props.defaultSortDirection] - optional default sort direction
 * @param {string} [props.defaultSortField] - optional default sort key
 * @param {(row: Row) => void} [props.onRowClick] - optional row click callback
 * @param {boolean} [props.isLoading] - optional loading state
 * @returns {JSX.Element}
 */

const Table = ({
  columns,
  rows,
  borderless,
  scrollable,
  className,
  customSort,
  defaultSortDirection = 'asc',
  defaultSortField,
  onRowClick,
  isLoading,
}) => {
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const { t } = useTranslation();

  useEffect(() => {
    if (customSort && sortField) customSort(sortField, sortDirection);
  }, [sortField, sortDirection]);

  function setCurrentSortField(newSortField) {
    if (sortField !== newSortField) {
      setSortField(newSortField);
      setSortDirection(defaultSortDirection);
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortDirection('asc');
    }
  }

  function getSortedData() {
    if (!sortField || !sortDirection || rows.length < 2 || customSort) {
      return rows;
    }

    const copiedRows = [...rows];
    const sortedFieldType = typeof rows[0][sortField];

    if (sortedFieldType === 'string') {
      if (sortDirection === 'asc') {
        return copiedRows.sort((a, b) => a[sortField]?.localeCompare(b[sortField]));
      }
      return copiedRows.sort((a, b) => b[sortField]?.localeCompare(a[sortField]));
    }
    if (sortedFieldType === 'number' || sortedFieldType === 'object') {
      if (sortDirection === 'asc') {
        return copiedRows.sort((a, b) => a[sortField] - b[sortField]);
      }
      return copiedRows.sort((a, b) => b[sortField] - a[sortField]);
    }
    return copiedRows;
  }

  const rowsToShow = getSortedData();

  if (isLoading) {
    return <StyledLoader text={t('Global.Loading')} monochrome />;
  }

  return (
    <TableWrap borderless={borderless} scrollable={scrollable} className={className}>
      <TableMain>
        <TableHead data-cy="tableHead">
          <TableRow data-cy="tableRow">
            {columns.map((col, index) => (
              <TableHeadCell key={col.key || col.name} style={{ ...col.style, zIndex: columns.length + 1 - index }}>
                <TableHeadCellFlex>
                  <TableHeadCellText
                    sortable={col.sortable}
                    onClick={() => {
                      if (col.sortable) setCurrentSortField(col.sortField);
                    }}
                  >
                    {col.name}
                  </TableHeadCellText>
                  <ArrowIconContainer>
                    {col.sortable && sortField === col.sortField && <ArrowIcon sort={sortDirection} />}
                  </ArrowIconContainer>
                  {col.headAction ? <TableHeadActionContainer>{col.headAction}</TableHeadActionContainer> : <></>}
                </TableHeadCellFlex>
              </TableHeadCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody data-cy="tableBody">
          {rowsToShow.map((row, rindex, allRows) => (
            <TableRow
              data-cy="tableRow"
              // eslint-disable-next-line react/no-array-index-key
              key={`row${rindex}`}
              className={row.__rowClassName}
              clickable={!!onRowClick}
              onClick={e => {
                if (typeof onRowClick === 'function') {
                  const tableCellElement = e.nativeEvent.target.closest('td');
                  const columnId = tableCellElement?.dataset.columnId;
                  onRowClick(row, { columnId });
                }
              }}
            >
              {columns.map((col, cindex) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableCell data-cy="tableCell" key={`cell${rindex}${cindex}`} data-column-id={col.id || undefined}>
                  {col.cellFormatter(row, rindex, allRows)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableMain>
    </TableWrap>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  borderless: PropTypes.bool,
  scrollable: PropTypes.bool,
  className: PropTypes.string,
  customSort: PropTypes.func,
  defaultSortDirection: PropTypes.oneOf(['asc', 'desc']),
  defaultSortField: PropTypes.string,
  onRowClick: PropTypes.func,
};

export default Table;
