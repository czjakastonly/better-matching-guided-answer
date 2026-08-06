import { type AiSourceType, AI_SOURCE } from 'stonly-editor/model/aiSource/aiSource.enum';

export const getTranslationMainKey = (type: AiSourceType, isElement?: boolean) => {
  switch (type) {
    case AI_SOURCE.web: {
      return 'AiSources.WebsiteUrl.';
    }
    case AI_SOURCE.zendesk: {
      return 'AiSources.ApiConnector.';
    }
    case AI_SOURCE.pdfGroup: {
      return isElement ? 'AiSources.Document.' : 'AiSources.DocumentGroup.';
    }
    case AI_SOURCE.guidedAnswer: {
      return 'AiSources.GuidedAnswers.';
    }
    default: {
      return '';
    }
  }
};
