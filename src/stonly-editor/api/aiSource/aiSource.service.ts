import {
  AI_SOURCE_STATUS,
  type AiSourceStatusType,
  type AiSourceType,
} from 'stonly-editor/model/aiSource/aiSource.enum';
import { type AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import { AiSourceApi } from './aiSource.api';

interface AiSourcesServiceType {
  getSourceWithElementsQueryKey: (options: {
    teamId: number;
    language: string;
    type: AiSourceType;
    status?: AiSourceStatusType;
  }) => readonly unknown[];
  getSourcesWithElements: (options: {
    teamId: number;
    language: string;
    type: AiSourceType;
    status?: AiSourceStatusType;
  }) => Promise<{
    sourceList: AiSourceModel.AiSource[];
    sourceElementByParentIdMap: { [parentId: string]: AiSourceModel.AiSourceElement[] };
    hasAnyElements: boolean;
  }>;
}

export const AiSourceService: AiSourcesServiceType = {
  getSourceWithElementsQueryKey: ({ teamId, language, type, status }) => [
    'aiSourceService',
    teamId,
    type,
    language,
    status,
  ],

  getSourcesWithElements: async ({ teamId, language, type, status }) => {
    const sourceList = await AiSourceApi.getSourceList({
      teamId,
      language,
      type,
      status,
    })
      .then(res => res.items.filter(s => !!s.enabled))
      .catch(() => []);

    if (!(sourceList.length > 0)) {
      return {
        sourceList: [],
        sourceElementByParentIdMap: {},
        hasAnyElements: false,
      };
    }
    let hasAnyElements = false;

    const elementsPromiseList = sourceList.map(({ searchSourceId }) =>
      AiSourceApi.getSourceElementsById({
        teamId,
        searchSourceId,
        language,
        status: status ?? AI_SOURCE_STATUS.COMPLETED,
        page: 1,
        limit: 2000,
      })
        .then(res => {
          if (res.itemsCounter > 0) {
            hasAnyElements = true;
          }
          return res.items;
        })
        .catch(() => [])
    );
    const elementsList = await Promise.all(elementsPromiseList);
    const sourceElementByParentIdMap = Object.fromEntries(
      sourceList.map((source, index) => [
        source.searchSourceId,
        (elementsList[index] || [])
          .filter(sourceElement => !!sourceElement.enabled)
          .map(sourceElement => {
            return { ...sourceElement, type: source.type };
          }),
      ])
    );

    return {
      sourceList,
      sourceElementByParentIdMap,
      hasAnyElements,
    };
  },
};
