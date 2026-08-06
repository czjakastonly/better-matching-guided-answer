import { useState, useEffect, useCallback, useRef } from 'react';
import { AiSourceApi } from 'stonly-editor/api/aiSource/aiSource.api';
import {
  AI_SOURCE_SORT_KEY,
  type AiSourceSortKeyType,
  type AiSourceStatusType,
  type AiSourceType,
} from 'stonly-editor/model/aiSource/aiSource.enum';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import { getSelectedStatusFilter } from '../helpers/source.helper';

export const PAGINATION_LIMIT = 100;

interface useGroupedSourceListActionsProps {
  teamId: number;
  type: AiSourceType;
  enableSearch: boolean;
  selectedStatusList?: AiSourceStatusType[];
  selectedLanguageList: string[];
  guideLaunchModeList?: string[];
}
export const useFetchSource = ({
  teamId,
  type,
  enableSearch = true,
  selectedStatusList,
  selectedLanguageList,
  guideLaunchModeList,
}: useGroupedSourceListActionsProps) => {
  const [orderBy, setOrderBy] = useState<AiSourceSortKeyType>(AI_SOURCE_SORT_KEY.lastRefreshed);
  const [orderDirection, setOrderDirection] = useState('desc');
  const [sourceList, setSourceList] = useState<AiSourceModel.AiSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [existsNext, setExistsNext] = useState(false);
  const [itemsCount, setItemsCount] = useState(0);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const searchDebounceRef = useRef<NodeJS.Timeout | undefined>();

  const loadSources = useCallback(() => {
    if (!teamId) return;
    setIsLoading(true);
    AiSourceApi.getSourceList({
      teamId,
      type,
      limit: PAGINATION_LIMIT,
      page,
      orderDirection,
      orderBy,
      status: selectedStatusList ? getSelectedStatusFilter(selectedStatusList) : undefined,
      language: selectedLanguageList.length > 0 ? selectedLanguageList.join(',') : undefined,
      name: debouncedSearchValue.length > 0 ? debouncedSearchValue : undefined,
      guideLaunchMode:
        guideLaunchModeList && guideLaunchModeList?.length > 0 ? guideLaunchModeList?.join(',') : undefined,
    })
      .then(data => {
        setSourceList(data.items);
        setItemsCount(data.itemsCounter);
        setExistsNext(data.existsNext);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    teamId,
    orderBy,
    orderDirection,
    page,
    selectedStatusList,
    selectedLanguageList,
    debouncedSearchValue,
    guideLaunchModeList,
  ]);

  useEffect(() => {
    if (enableSearch) {
      loadSources();
    }
  }, [loadSources, enableSearch]);

  const setSourceSortingOrder = (newOrderBy: AiSourceSortKeyType, newOrderDirection: string) => {
    setOrderBy(newOrderBy);
    setOrderDirection(newOrderDirection);
  };

  const onSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = e.target.value || '';
    setSearchValue(newSearchValue);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    if (!newSearchValue.length) {
      setDebouncedSearchValue(newSearchValue);
    } else if (newSearchValue.length > 2) {
      searchDebounceRef.current = setTimeout(() => {
        setDebouncedSearchValue(newSearchValue);
      }, 500);
    }
  };

  return {
    setSourceSortingOrder,
    isLoading,
    sourceList,
    page,
    setPage,
    loadSources,
    itemsCount,
    existsNext,
    orderDirection,
    orderBy,
    searchValue,
    onSearchValueChange,
  };
};
