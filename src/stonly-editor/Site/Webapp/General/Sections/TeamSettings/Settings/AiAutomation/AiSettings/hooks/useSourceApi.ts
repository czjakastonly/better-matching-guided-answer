import { usePushNotification } from '@editorCommon/hooks/useNotifications';
import { useTranslation } from 'react-i18next';
import { AiSourceApi } from 'stonly-editor/api/aiSource/aiSource.api';
import { type AiSourceDto } from 'stonly-editor/api/aiSource/aiSource.dto';
import { AI_SOURCE, type AiSourceType } from 'stonly-editor/model/aiSource/aiSource.enum';

const getTranslationPart = (type: AiSourceType) => {
  if (type === AI_SOURCE.pdfGroup) {
    return 'DocumentGroup.';
  }
  if (type === AI_SOURCE.guidedAnswer) {
    return 'GuidedAnswers.';
  }
  return '';
};

interface useSourceApiProps {
  loadSources: () => void;
  teamId: number;
}
export const useSourceApi = ({ loadSources, teamId }: useSourceApiProps) => {
  const pushNotification = usePushNotification();
  const { t } = useTranslation();

  const addSource = (values: Omit<AiSourceDto.CreateAiSource, 'teamId'>) => {
    return AiSourceApi.createSource({ teamId, ...values, type: values.type.toLowerCase() })
      .then(searchSourceId => {
        loadSources();
        pushNotification({
          content: t(`AiSources.${getTranslationPart(values.type as AiSourceType)}ToastCreateSuccess`),
          timeout: 5000,
          status: 'success',
        });
        return searchSourceId;
      })
      .catch((e: { errorData?: { message: string } }) => {
        pushNotification({
          content: t('AiSources.ToastCreateError') + (e.errorData ? `: ${e.errorData.message}` : ''),
          timeout: 5000,
          status: 'error',
        });
      });
  };

  const removeSource = ({ searchSourceId, type }: { searchSourceId: number; type: AiSourceType }) => {
    AiSourceApi.deleteSource({ teamId, searchSourceId })
      .then(() => {
        loadSources();
        pushNotification({
          content: t(`AiSources.${getTranslationPart(type)}ToastDeleteSuccess`),
          timeout: 5000,
          status: 'success',
        });
      })
      .catch(() =>
        pushNotification({
          content: t('AiSources.ToastDeleteError'),
          timeout: 5000,
          status: 'error',
        })
      );
  };

  const editSource = ({ searchSourceId, name, type }: { searchSourceId: number; name: string; type: AiSourceType }) => {
    AiSourceApi.updateSource({ teamId, searchSourceId, name })
      .then(() => {
        loadSources();
        pushNotification({
          content: t(`AiSources.${getTranslationPart(type)}ToastEditSuccess`),
          timeout: 5000,
          status: 'success',
        });
      })
      .catch(() =>
        pushNotification({
          content: t('AiSources.ToastEditError'),
          timeout: 5000,
          status: 'error',
        })
      );
  };

  const toggleSource = ({
    searchSourceId,
    enabled,
    type,
  }: {
    searchSourceId: number;
    enabled: boolean;
    type: AiSourceType;
  }) => {
    AiSourceApi.toggleSource({ teamId, searchSourceId, enabled })
      .then(() => {
        loadSources();
        pushNotification({
          content: t(`AiSources.${getTranslationPart(type)}${enabled ? 'ToastEnableSuccess' : 'ToastDisableSuccess'}`),
          timeout: 5000,
          status: 'success',
        });
      })
      .catch(() =>
        pushNotification({
          content: t(enabled ? 'AiSources.ToastEnableError' : 'AiSources.ToastDisableError'),
          timeout: 5000,
          status: 'error',
        })
      );
  };

  const reloadSource = (searchSourceId: number) => {
    AiSourceApi.reloadSource({ teamId, searchSourceId })
      .then(() => {
        loadSources();
        pushNotification({
          content: t('AiSources.ToastReloadSuccess'),
          timeout: 5000,
          status: 'success',
        });
      })
      .catch(() =>
        pushNotification({
          content: t('AiSources.ToastReloadError'),
          timeout: 5000,
          status: 'error',
        })
      );
  };

  const addSourceElements = (data: Omit<AiSourceDto.CreateAiSourceElements, 'teamId'>) => {
    return AiSourceApi.createSourceElements({ teamId, ...data }).catch(e => {
      pushNotification({
        content: t('AiSources.ToastAddElementsError'),
        timeout: 5000,
        status: 'error',
      });
      throw e;
    });
  };

  const createGuidedAnswer = (values: Omit<AiSourceDto.CreateGuidedAnswer, 'teamId'>) => {
    return AiSourceApi.createGuidedAnswer({ teamId, ...values })
      .then(searchSourceId => {
        loadSources();
        pushNotification({
          content: t(`AiSources.GuidedAnswers.ToastCreateSuccess`),
          timeout: 5000,
          status: 'success',
        });
        return searchSourceId;
      })
      .catch((e: { errorData?: { message: string } }) => {
        pushNotification({
          content: t('AiSources.ToastCreateError') + (e.errorData ? `: ${e.errorData.message}` : ''),
          timeout: 5000,
          status: 'error',
        });
      });
  };

  const updateGuidedAnswer = (data: Omit<AiSourceDto.UpdateGuidedAnswer, 'teamId'>) => {
    return AiSourceApi.updateGuidedAnswer({ teamId, ...data })
      .then(searchSourceId => {
        loadSources();
        pushNotification({
          content: t(`AiSources.GuidedAnswers.ToastEditSuccess`),
          timeout: 5000,
          status: 'success',
        });
        return searchSourceId;
      })
      .catch((e: { errorData?: { message: string } }) => {
        pushNotification({
          content: t('AiSources.ToastEditError') + (e.errorData ? `: ${e.errorData.message}` : ''),
          timeout: 5000,
          status: 'error',
        });
      });
  };

  return {
    addSource,
    removeSource,
    editSource,
    reloadSource,
    toggleSource,
    addSourceElements,
    createGuidedAnswer,
    updateGuidedAnswer,
  };
};
