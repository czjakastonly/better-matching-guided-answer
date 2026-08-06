import { type AiSourceType } from 'stonly-editor/model/aiSource/aiSource.enum';

export declare namespace AiSourceDto {
  export interface AiSourceProperties {
    singlePage: boolean;
    excludePaths: string[];
  }
  export interface AiSource {
    searchSourceId: number;
    name: string;
    type: 'WEB' | 'ZENDESK' | 'GROUP_PDF';
    url: string;
    status: 'NEW' | 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    usedIn: number | null;
    enabled: 0 | 1;
    creationDate: number;
    updateDate: number;
    properties: AiSourceDto.AiSourceProperties | AiSourceDto.GuidedAnswerProperties;
    languageList: string | null;
    elementsCount: number;
    enabledElementsCount?: number;
    guideTitle?: { [key: string]: { title: string; consoleTitle: string } } | null;
    stepTitle?: { [key: string]: { title: string } } | null;
    guideLanguages?: string;
  }

  export interface AiSourceElement {
    searchSourceElementId: number;
    searchSourceId: number;
    name: string;
    parentId: number | null;
    parentName: string;
    url: string;
    status: 'NEW' | 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    enabled: 0 | 1;
    usedIn: number | null;
    creationDate: number;
    updateDate: number;
    language: string;
  }

  export interface GetAiSource {
    teamId: number;
    searchSourceId: number;
  }

  export interface GetAiSourceList {
    teamId: number;
    type?: AiSourceType;
    orderBy?: string;
    orderDirection?: string;
    limit?: number;
    page?: number;
    status?: string;
    language?: string;
    name?: string;
    guideLaunchMode?: string;
  }

  export interface GetAiSourceElements {
    teamId: number;
    searchSourceId?: number;
    language?: string;
    status?: string;
    name?: string;
    url?: string;
    orderBy?: string;
    orderDirection?: string;
    limit?: number;
    page?: number;
    type?: AiSourceType;
    url?: string;
  }

  //

  export interface CreateAiSource {
    teamId: number;
    name: string;
    type: string; // AiSourceType in lower case
    url?: string;
    properties?: AiSourceDto.AiSourceProperties;
  }

  export interface CreatedAiSource {
    searchSourceId: number;
  }
  export interface LanguageOptions {
    language?: string;
    detectLanguage?: boolean;
  }

  export interface CreateAiSourceElements {
    teamId: number;
    searchSourceId: number;
    type: string; // AiSourceType in lower case
    languageOptions: LanguageOptions;
    searchSourceElements: string[];
  }

  //

  export interface UpdateAiSource {
    teamId: number;
    searchSourceId: number;
    name: string;
  }

  export interface UpdateAiSourceElement {
    teamId: number;
    searchSourceId: number;
    searchSourceElementId: number;
    name?: string;
    language?: string;
    type: string; // AiSourceType in lower case
  }

  export interface ReloadAiSource {
    teamId: number;
    searchSourceId: number;
  }

  export interface ToggleAiSource {
    teamId: number;
    searchSourceId: number;
    enabled: boolean;
  }

  export interface ToggleAiSourceElement {
    searchSourceElementId: number;
    enabled: boolean;
  }

  export interface ToggleAiSourceElementsList {
    teamId: number;
    searchSourceId: number;
    searchSourceElementStates: ToggleAiSourceElement[];
  }

  //

  export interface RemoveAiSource {
    teamId: number;
    searchSourceId: number;
  }

  export interface RemoveAiSourceElement {
    teamId: number;
    searchSourceId: number;
    searchSourceElementId: number;
    type: string; // AiSourceType in lower case
  }

  export interface GetAiSourceUsage {
    teamId: number;
    searchSourceId: number;
  }

  export interface GetAiSourceElementUsage {
    teamId: number;
    searchSourceElementId: number;
    includeGroup?: boolean;
  }

  /* Guided Answer */
  export interface GuidedAnswerProperties {
    guideId?: string;
    stepStartType?: 'FIRST_STEP' | 'SPECIFIC_STEP';
    startFromStepId?: number;
    customLoadingMessage?: { [key: string]: string | undefined };
    customMessage?: { [key: string]: string };
    guideLaunchMode: 'redirected' | 'embedded' | 'customMessage' | 'bpa';
    matchingMode?: 'queries' | 'intent';
    intentDescription?: string;
  }

  export interface GuidedAnswerQuery {
    query: string;
    language: string;
  }

  export interface CreateGuidedAnswer {
    teamId: number;
    name: string;
    queries: GuidedAnswerQuery[];
    properties: AiSourceDto.GuidedAnswerProperties;
  }

  export interface UpdateQueries {
    updated: (GuidedAnswerQuery & { searchSourceElementId: number })[];
    removed: number[];
    added: GuidedAnswerQuery[];
  }

  export interface UpdateGuidedAnswer extends UpdateAiSource {
    queries: UpdateQueries;
    properties: AiSourceDto.GuidedAnswerProperties;
  }
}
