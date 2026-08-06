/**
 * MOCK of the editor's AiSourceApi for the standalone demo.
 * Same surface and return shapes as the real module; all data lives in mockDb (in-memory).
 */
import { type AiSourceType } from '../../model/aiSource/aiSource.enum';
import { type AiSourceModel } from '../../model/aiSource/aiSource.model';
import { type AiSourceDto } from './aiSource.dto';
import { db, delay, newElement, nextSourceId, MOCK_GUIDES } from './mockDb';

const EMPTY_USAGE: AiSourceModel.AiSourceUsageResponse = {
  step: [],
  kb: [],
  agentAssist: [],
  agentAssistReply: [],
  aiAgents: [],
};

const applyListFilters = (data: {
  name?: string;
  status?: string;
  language?: string;
  guideLaunchMode?: string;
  orderDirection?: string;
}) => {
  let list = [...db.sources];
  if (data.name) {
    const needle = data.name.toLowerCase();
    list = list.filter(s => s.name.toLowerCase().includes(needle));
  }
  if (data.status) {
    const statusList = data.status.split(',');
    list = list.filter(s => {
      const stateKey = s.enabled ? 'ENABLED' : 'DISABLED';
      return statusList.includes(stateKey) || statusList.includes(s.status);
    });
  }
  if (data.language) {
    const languageList = data.language.split(',');
    list = list.filter(s => (s.languageList || []).some(l => languageList.includes(l)));
  }
  if (data.guideLaunchMode) {
    const modeList = data.guideLaunchMode.split(',');
    list = list.filter(s => modeList.includes((s.properties as { guideLaunchMode?: string })?.guideLaunchMode || ''));
  }
  list.sort((a, b) => (data.orderDirection === 'asc' ? a.updateDate - b.updateDate : b.updateDate - a.updateDate));
  return list;
};

export const AiSourceApi = {
  aiSourceQueryKey: 'aiSource',
  getSourceListQueryKey: ({ teamId, type }: { teamId: number; type: AiSourceType }) => [
    'team',
    teamId,
    'aiSource',
    type,
  ],
  sourceUsageQueryKey: 'sourceUsage',
  sourceElementUsageQueryKey: 'sourceElementUsage',
  getSourceElementsByIdQueryKey: ({ teamId, searchSourceId }: { teamId: number; searchSourceId: number }) => [
    'team',
    teamId,
    'aiSource',
    searchSourceId,
    'elements',
  ],

  getSourceList: (data: {
    teamId: number;
    type: AiSourceType;
    limit?: number;
    page?: number;
    orderDirection?: string;
    orderBy?: string;
    status?: string;
    language?: string;
    name?: string;
    guideLaunchMode?: string;
  }): Promise<{ existsNext: boolean; itemsCounter: number; items: AiSourceModel.AiSource[]; websiteLimit?: number }> => {
    const filtered = applyListFilters(data);
    const limit = data.limit || 100;
    const page = data.page || 1;
    const items = filtered.slice((page - 1) * limit, page * limit);
    return delay({ existsNext: page * limit < filtered.length, itemsCounter: filtered.length, items });
  },

  getSource: (data: { teamId: number; searchSourceId: number }): Promise<AiSourceModel.AiSource | null> =>
    delay(db.sources.find(s => s.searchSourceId === data.searchSourceId) || null),

  getSourceElementsById: (data: {
    teamId: number;
    searchSourceId: number;
    limit?: number;
    page?: number;
  }): Promise<{ existsNext: boolean; itemsCounter: number; items: AiSourceModel.AiSourceElement[] }> => {
    const items = (db.elementsBySourceId.get(data.searchSourceId) || []) as unknown as AiSourceModel.AiSourceElement[];
    return delay({ existsNext: false, itemsCounter: items.length, items });
  },

  getSourceUsageById: (): Promise<AiSourceModel.AiSourceUsageResponse> => delay(EMPTY_USAGE),
  getSourceElementUsageById: (): Promise<AiSourceModel.AiSourceUsageResponse> => delay(EMPTY_USAGE),

  createGuidedAnswer: (data: AiSourceDto.CreateGuidedAnswer & { teamId: number }): Promise<AiSourceDto.CreatedAiSource> => {
    const searchSourceId = nextSourceId();
    const now = Math.floor(Date.now() / 1000);
    const elements = (data.queries || []).map(q => newElement(searchSourceId, q.query, q.language));
    db.elementsBySourceId.set(searchSourceId, elements);
    const properties = data.properties as { guideId?: string | null; guideLaunchMode: string; customMessage?: Record<string, string> };
    const guide = MOCK_GUIDES.find(g => g.id === properties.guideId);
    const languageList = [...new Set(elements.map(e => e.language))];
    db.sources.unshift({
      searchSourceId,
      name: data.name,
      type: 'GUIDED_ANSWER',
      url: '',
      status: 'COMPLETED',
      usedIn: null,
      enabled: 1,
      creationDate: now,
      updateDate: now,
      properties,
      languageList,
      elementsCount: elements.length,
      enabledElementsCount: elements.length,
      guideTitle: guide
        ? Object.fromEntries(guide.languageList.split(',').map(l => [l, { title: guide.title, consoleTitle: guide.title }]))
        : null,
      stepTitle: null,
      guideLanguageList: guide ? guide.languageList.split(',') : languageList,
    } as unknown as AiSourceModel.GuidedAnswer);
    return delay({ searchSourceId });
  },

  updateGuidedAnswer: (data: AiSourceDto.UpdateGuidedAnswer & { teamId: number }): Promise<void> => {
    const source = db.sources.find(s => s.searchSourceId === data.searchSourceId);
    if (source) {
      const now = Math.floor(Date.now() / 1000);
      if (data.name !== undefined) source.name = data.name;
      if (data.properties) {
        source.properties = data.properties as typeof source.properties;
        const guide = MOCK_GUIDES.find(g => g.id === (data.properties as { guideId?: string | null }).guideId);
        (source as unknown as { guideTitle: unknown }).guideTitle = guide
          ? Object.fromEntries(guide.languageList.split(',').map(l => [l, { title: guide.title, consoleTitle: guide.title }]))
          : null;
        if (guide) (source as unknown as { guideLanguageList: string[] }).guideLanguageList = guide.languageList.split(',');
      }
      const elements = db.elementsBySourceId.get(data.searchSourceId) || [];
      const queries = data.queries as
        | { updated: { searchSourceElementId: number; query: string; language: string }[]; removed: number[]; added: { query: string; language: string }[] }
        | undefined;
      if (queries) {
        queries.removed?.forEach(id => {
          const index = elements.findIndex(e => e.searchSourceElementId === id);
          if (index >= 0) elements.splice(index, 1);
        });
        queries.updated?.forEach(u => {
          const el = elements.find(e => e.searchSourceElementId === u.searchSourceElementId);
          if (el) { el.name = u.query; el.language = u.language; el.updateDate = now; }
        });
        queries.added?.forEach(a => elements.push(newElement(data.searchSourceId, a.query, a.language)));
      }
      db.elementsBySourceId.set(data.searchSourceId, elements);
      source.elementsCount = elements.length;
      (source as unknown as { enabledElementsCount: number }).enabledElementsCount = elements.length;
      (source as unknown as { languageList: string[] }).languageList = [...new Set(elements.map(e => e.language))];
      source.updateDate = now;
    }
    return delay(undefined);
  },

  createSource: (): Promise<number> => delay(nextSourceId()),
  updateSource: (data: { teamId?: number; searchSourceId: number; name: string }): Promise<void> => {
    const source = db.sources.find(s => s.searchSourceId === data.searchSourceId);
    if (source) source.name = data.name;
    return delay(undefined);
  },
  deleteSource: (data: { teamId?: number; searchSourceId: number }): Promise<void> => {
    const index = db.sources.findIndex(s => s.searchSourceId === data.searchSourceId);
    if (index >= 0) db.sources.splice(index, 1);
    db.elementsBySourceId.delete(data.searchSourceId);
    return delay(undefined);
  },
  toggleSource: (data: { teamId?: number; searchSourceId: number; enabled: 0 | 1 }): Promise<void> => {
    const source = db.sources.find(s => s.searchSourceId === data.searchSourceId);
    if (source) source.enabled = data.enabled;
    return delay(undefined);
  },
  reloadSource: (): Promise<void> => delay(undefined),
  createSourceElements: (): Promise<void> => delay(undefined),
  updateSourceElement: (): Promise<void> => delay(undefined),
  deleteSourceElement: (): Promise<void> => delay(undefined),
  toggleSourceElements: (): Promise<void> => delay(undefined),
};
