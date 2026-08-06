import { useContext, useMemo } from 'react';
import userContext from '@editorCommon/Contexts/userContext.js';

export default function useUserManagement() {
  return useContext(userContext);
}

export const useUserManagementResolvers = () => {
  const userManagement = useContext(userContext);

  return useMemo(
    () => ({
      resolveIsUserTeamAdmin: teamId => {
        const currentTeam = userManagement.user.teams.find(team => team.teamId === teamId);
        return currentTeam?.rights === 'admin';
      },
      resolveIsUserTeamOwner: teamId => {
        const currentTeam = userManagement.user.teams.find(team => team.teamId === teamId);
        return !!currentTeam?.owner;
      },
    }),
    [userManagement]
  );
};
