import { type AiSourceModel } from '../../model/aiSource/aiSource.model';

/** In-memory mock database for the standalone demo. Resets on refresh. */

export interface MockGuide {
  id: string;
  title: string;
  languageList: string; // comma-separated, BE style
  bpaEnabled: boolean;
  steps: { id: number; name: string }[];
}

export const MOCK_GUIDES: MockGuide[] = [
  {
    id: 'g-1001', title: 'Creating and publishing guides', languageList: 'en,fr', bpaEnabled: false,
    steps: [{ id: 11, name: 'Introduction' }, { id: 12, name: 'Create a draft' }, { id: 13, name: 'Publish your guide' }],
  },
  {
    id: 'g-1002', title: 'Exporting your data', languageList: 'en,fr', bpaEnabled: false,
    steps: [{ id: 21, name: 'Open export settings' }, { id: 22, name: 'Choose CSV format' }, { id: 23, name: 'Troubleshoot downloads' }],
  },
  {
    id: 'g-1003', title: 'Widget installation', languageList: 'en,fr,de', bpaEnabled: false,
    steps: [{ id: 31, name: 'Copy the snippet' }, { id: 32, name: 'Verify installation' }],
  },
  {
    id: 'g-1004', title: 'Cancellation Flow v2', languageList: 'en', bpaEnabled: true,
    steps: [{ id: 41, name: 'Collect account details' }, { id: 42, name: 'Confirm cancellation' }],
  },
];

const now = Math.floor(Date.now() / 1000);
const daysAgo = (d: number) => now - d * 86400;

let elementIdSeq = 9000;
let sourceIdSeq = 5000;

export interface MockElement {
  searchSourceElementId: number;
  searchSourceId: number;
  name: string;
  language: string;
  enabled: 0 | 1;
  status: string;
  creationDate: number;
  updateDate: number;
  parentId: null;
  parentName: '';
  url: '';
  usedIn: null;
}

const makeElement = (searchSourceId: number, name: string, language: string): MockElement => ({
  searchSourceElementId: elementIdSeq++,
  searchSourceId,
  name,
  language,
  enabled: 1,
  status: 'COMPLETED',
  creationDate: daysAgo(30),
  updateDate: daysAgo(3),
  parentId: null,
  parentName: '',
  url: '',
  usedIn: null,
});

interface SeedSpec {
  name: string;
  guide?: MockGuide;
  launchMode: 'embedded' | 'redirected' | 'customMessage' | 'bpa';
  updateDate: number;
  enabled: 0 | 1;
  queries: Record<string, string[]>;
  customMessage?: Record<string, string>;
}

const SEEDS: SeedSpec[] = [
  {
    name: "My guide can't be saved", guide: MOCK_GUIDES[0], launchMode: 'embedded', updateDate: daysAgo(0.5), enabled: 1,
    queries: { en: ['How do I save my guide?', 'I lost my changes', "Guide won't publish"], fr: ['Comment enregistrer mon guide ?', "J'ai perdu mes modifications"] },
  },
  {
    name: "Export won't download", guide: MOCK_GUIDES[1], launchMode: 'embedded', updateDate: daysAgo(1), enabled: 1,
    queries: { en: ['How do I export data?', 'Export to CSV not working', 'Where is my downloaded file?', 'Download button does nothing'], fr: ['Comment exporter mes données ?'] },
  },
  {
    name: 'Cancel subscription', guide: MOCK_GUIDES[3], launchMode: 'bpa', updateDate: daysAgo(38), enabled: 1,
    queries: { en: ['I want to cancel my subscription'] },
  },
  {
    name: 'Refund policy question', launchMode: 'customMessage', updateDate: daysAgo(70), enabled: 0,
    queries: { en: ['Can I get a refund?', 'Refund policy'] },
    customMessage: { en: 'Refunds are available within 30 days of purchase. Contact support@company.com with your order number.' },
  },
  {
    name: 'Multilingual AI step', guide: MOCK_GUIDES[2], launchMode: 'embedded', updateDate: daysAgo(280), enabled: 1,
    queries: { en: ['How do languages work?', 'Change widget language'], fr: ['Comment fonctionnent les langues ?'] },
  },
  {
    name: 'Reset user password', guide: MOCK_GUIDES[3], launchMode: 'bpa', updateDate: daysAgo(320), enabled: 1,
    queries: { en: ["I can't log in", 'Forgot my password'] },
  },
];

export const db: {
  sources: AiSourceModel.GuidedAnswer[];
  elementsBySourceId: Map<number, MockElement[]>;
} = { sources: [], elementsBySourceId: new Map() };

const seed = (spec: SeedSpec) => {
  const searchSourceId = sourceIdSeq++;
  const elements = Object.entries(spec.queries).flatMap(([language, list]) =>
    list.map(q => makeElement(searchSourceId, q, language))
  );
  db.elementsBySourceId.set(searchSourceId, elements);
  const guideLanguageList = spec.guide ? spec.guide.languageList.split(',') : Object.keys(spec.queries);
  db.sources.push({
    searchSourceId,
    name: spec.name,
    type: 'GUIDED_ANSWER',
    url: '',
    status: 'COMPLETED',
    usedIn: null,
    enabled: spec.enabled,
    creationDate: spec.updateDate - 86400 * 10,
    updateDate: spec.updateDate,
    properties: {
      guideId: spec.guide ? spec.guide.id : null,
      stepStartType: spec.launchMode === 'customMessage' || spec.launchMode === 'bpa' ? undefined : 'FIRST_STEP',
      guideLaunchMode: spec.launchMode,
      customMessage: spec.customMessage,
    },
    languageList: [...new Set(Object.keys(spec.queries))],
    elementsCount: elements.length,
    enabledElementsCount: elements.length,
    guideTitle: spec.guide
      ? Object.fromEntries(guideLanguageList.map(l => [l, { title: spec.guide!.title, consoleTitle: spec.guide!.title }]))
      : null,
    stepTitle: null,
    guideLanguageList,
  } as unknown as AiSourceModel.GuidedAnswer);
};
SEEDS.forEach(seed);

export const nextSourceId = () => sourceIdSeq++;
export const newElement = makeElement;
export const delay = <T,>(value: T, ms = 250): Promise<T> => new Promise(resolve => setTimeout(() => resolve(value), ms));
