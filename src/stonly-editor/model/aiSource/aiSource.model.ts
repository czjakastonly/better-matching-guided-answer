import type {
  AI_SOURCE,
  AiSourceStatusType,
  AiSourceType,
  GuidedAnswerLaunchModeType,
  GuidedAnswerMatchingModeType,
  GuidedAnswerStartType,
} from './aiSource.enum';

export declare namespace AiSourceModel {
  export interface AiSource {
    searchSourceId: number;
    name: string;
    type: AiSourceType;
    url: string;
    status: AiSourceStatusType;
    usedIn: number | null;
    enabled: 0 | 1;
    creationDate: number;
    updateDate: number;
    properties: AiSourceModel.AiSourceProperties | AiSourceModel.GuidedAnswerProperties;
    languageList: string[];
    elementsCount: number;
    enabledElementsCount?: number;
    guideTitle?: { [key: string]: { title: string; consoleTitle: string } } | null;
    stepTitle?: { [key: string]: { title: string } } | null;
    guideLanguageList?: string[];
  }

  export interface AiSourceProperties {
    singlePage: boolean;
    excludePaths: string[];
  }

  export interface AiSourceElement {
    searchSourceElementId: number;
    searchSourceId: number;
    name: string;
    parentId: number | null;
    parentName: string;
    url: string;
    status: AiSourceStatusType;
    enabled: 0 | 1;
    creationDate: number;
    updateDate: number;
    language: string;
    usedIn: number | null;
  }

  export interface AiSourceKbUsage {
    type: 'KB';
    knowledgeBaseId: number;
    rootFolderName: string;
  }

  export interface AiSourceStepUsage {
    type: 'STEP';
    guideId: string;
    guideTitle: string;
    typeId: number;
    stepModuleTitle: string;
  }

  export interface AiSourceAiAgentUsage {
    type: 'AI_AGENT';
    typeId: number;
    teamAiAgentName: string;
  }

  export interface AiSourceUsageResponse {
    step: AiSourceStepUsage[];
    kb: AiSourceKbUsage[];
    agentAssist: AiSourceKbUsage[];
    agentAssistReply: AiSourceKbUsage[];
    aiAgents: AiSourceAiAgentUsage[];
  }

  /* Guided Answer */
  export interface GuidedAnswerProperties {
    guideId: string | null;
    stepStartType: GuidedAnswerStartType;
    startFromStepId?: number;
    customLoadingMessage?: { [key: string]: string | undefined };
    customMessage?: { [key: string]: string };
    guideLaunchMode: GuidedAnswerLaunchModeType;
    matchingMode?: GuidedAnswerMatchingModeType;
    intentDescription?: string;
  }

  export interface GuidedAnswer extends AiSource {
    type: AiSourceType & typeof AI_SOURCE.guidedAnswer;
    properties: GuidedAnswerProperties;
    guideTitle: { [key: string]: { title: string; consoleTitle: string } } | null;
    stepTitle: { [key: string]: { title: string } } | null;
    guideLanguageList: string[];
  }
}
