import React from 'react';
import { AiSourceApi } from 'stonly-editor/api/aiSource/aiSource.api';
import { useQuery } from '@tanstack/react-query';
import { OccurrencesTable } from '../../../common/OccurrencesTable/OccurrencesTable';

interface SourceIsUsedInTableProps {
  teamId: number;
  sourceId: number;
  framed: boolean;
}

const SourceIsUsedInTable = ({ teamId, sourceId, framed = false }: SourceIsUsedInTableProps) => {
  const { data: usageData, isLoading } = useQuery({
    queryKey: [AiSourceApi.sourceUsageQueryKey, teamId, sourceId],
    queryFn: () => AiSourceApi.getSourceUsageById({ teamId, searchSourceId: sourceId }),
    placeholderData: { step: [], kb: [], agentAssist: [], agentAssistReply: [], aiAgents: [] },
    enabled: !!teamId && !!sourceId,
    cacheTime: 0,
  });

  return (
    <OccurrencesTable
      framed={framed}
      isLoading={isLoading}
      stepList={usageData?.step ?? []}
      knowledgeBaseList={usageData?.kb ?? []}
      agentAssistKbList={usageData?.agentAssist ?? []}
      agentAssistReplyKbList={usageData?.agentAssistReply ?? []}
      agentList={usageData?.aiAgents ?? []}
      teamId={teamId}
    />
  );
};

export default SourceIsUsedInTable;
