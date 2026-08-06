import React from 'react';
import { AiSourceApi } from 'stonly-editor/api/aiSource/aiSource.api';
import { useQuery } from '@tanstack/react-query';
import { OccurrencesTable } from '../../../common/OccurrencesTable/OccurrencesTable';

interface SourceElementIsUsedInTableProps {
  teamId: number;
  sourceId: number;
  framed: boolean;
}
const SourceElementIsUsedInTable = ({ teamId, sourceId, framed = false }: SourceElementIsUsedInTableProps) => {
  const { data: usageData, isLoading } = useQuery({
    queryKey: [AiSourceApi.sourceElementUsageQueryKey, teamId, sourceId],
    queryFn: () =>
      AiSourceApi.getSourceElementUsageById({
        teamId,
        searchSourceElementId: sourceId,
        includeGroup: true,
      }),
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

export default SourceElementIsUsedInTable;
