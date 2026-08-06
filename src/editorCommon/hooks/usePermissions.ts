/** Demo stub of the editor's permissions hook. */
const PERMISSION: Record<string, string> = new Proxy({}, { get: (_t, name) => String(name) }) as Record<string, string>;

export const useGetTeamPermission = (): [(permission: string, teamId?: number) => boolean, Record<string, string>] => {
  const getTeamPermission = (permission: string) => permission !== 'CAN_USE_KNOWLEDGE_AGENTS';
  return [getTeamPermission, PERMISSION];
};
