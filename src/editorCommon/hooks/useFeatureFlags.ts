/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { useCallback, useMemo } from 'react';
import useUserManagement from './useUserManagement';

type Team = {
  teamId: number;
  featureFlags: Record<string, number>;
};

type User = {
  teams: Team[];
};

type UserManagement = {
  user: User;
};

const useFeatureFlags = () => {
  const { user } = useUserManagement() as unknown as UserManagement;

  const featureFlagsByTeamId = useMemo(() => {
    return Object.fromEntries(user.teams.map(team => [team.teamId, team.featureFlags]));
  }, [user]);

  const getIsFeatureFlagEnabledForTeam = useCallback(
    (teamId: number, featureFlagName: string) => {
      return featureFlagsByTeamId?.[teamId]?.[featureFlagName] === 1;
    },
    [featureFlagsByTeamId]
  );

  return { getIsFeatureFlagEnabledForTeam };
};

export default useFeatureFlags;
