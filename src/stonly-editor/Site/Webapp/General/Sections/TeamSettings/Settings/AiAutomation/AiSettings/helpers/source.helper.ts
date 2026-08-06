import { fileUrl } from '@stonlyCommons/global/env';
import { AI_SOURCE_STATUS, AI_SOURCE } from 'stonly-editor/model/aiSource/aiSource.enum';
import type { AiSourceStatusType, AiSourceType } from 'stonly-editor/model/aiSource/aiSource.enum';

export const getStatusTranslationKey = (status: AiSourceStatusType): string => {
  switch (status) {
    case AI_SOURCE_STATUS.NEW:
    case AI_SOURCE_STATUS.QUEUED:
    case AI_SOURCE_STATUS.IN_PROGRESS: {
      return 'AiSources.StatusProcessing';
    }
    case AI_SOURCE_STATUS.COMPLETED: {
      return 'AiSources.StatusReady';
    }
    case AI_SOURCE_STATUS.FAILED: {
      return 'AiSources.StatusError';
    }
    default: {
      return '';
    }
  }
};

export const getStatusOptions = (): { label: string; value: AiSourceStatusType }[] => {
  return [
    { label: getStatusTranslationKey(AI_SOURCE_STATUS.IN_PROGRESS), value: AI_SOURCE_STATUS.IN_PROGRESS },
    { label: getStatusTranslationKey(AI_SOURCE_STATUS.COMPLETED), value: AI_SOURCE_STATUS.COMPLETED },
    { label: getStatusTranslationKey(AI_SOURCE_STATUS.FAILED), value: AI_SOURCE_STATUS.FAILED },
  ];
};

export const convertStatusToNumber = (status: AiSourceStatusType): number => {
  switch (status) {
    case AI_SOURCE_STATUS.NEW:
    case AI_SOURCE_STATUS.QUEUED:
    case AI_SOURCE_STATUS.IN_PROGRESS: {
      return 1;
    }
    case AI_SOURCE_STATUS.COMPLETED: {
      return 0;
    }
    case AI_SOURCE_STATUS.FAILED: {
      return 2;
    }
    default: {
      return 3;
    }
  }
};

export const getSourceUrl = ({ url, type, isElement }: { url: string; type: AiSourceType; isElement?: boolean }) => {
  if (type === AI_SOURCE.pdfGroup && !isElement) {
    return null;
  }
  if (type === AI_SOURCE.pdfGroup && isElement) {
    return `${fileUrl}/${url}`;
  }
  return url;
};

export const getSelectedStatusFilter = (selectedStatusList: AiSourceStatusType[]) => {
  if (selectedStatusList.length > 0) {
    const statusFilterList = [...selectedStatusList];
    if (selectedStatusList.includes(AI_SOURCE_STATUS.IN_PROGRESS))
      statusFilterList.push(AI_SOURCE_STATUS.NEW, AI_SOURCE_STATUS.QUEUED);
    return statusFilterList.join(',');
  }
  return undefined;
};

export const getGuideTitle = ({
  guideTitle,
  language,
}: {
  guideTitle?: { [key: string]: { title: string; consoleTitle: string } } | null;
  language: string;
}) => {
  if (!guideTitle) {
    return undefined;
  }
  const firstAvailableLanguage = Object.keys(guideTitle)[0];
  return guideTitle[language]?.title || guideTitle[firstAvailableLanguage]?.title;
};

export const getStepTitle = ({
  stepTitle,
  language,
}: {
  stepTitle: { [key: string]: { title: string } } | undefined | null;
  language: string;
}) => {
  if (!stepTitle) {
    return undefined;
  }
  const firstAvailableLanguage = Object.keys(stepTitle)[0];
  return stepTitle[language]?.title || stepTitle[firstAvailableLanguage]?.title;
};
