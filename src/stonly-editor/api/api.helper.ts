import type { InfiniteData } from '@tanstack/react-query';
import { type ApiDto } from 'stonly-editor/api/api.dto';

export const ApiHelper = {
  toData: <ResponseData>(response: { data: ResponseData }): ResponseData => response.data,

  infiniteQueryPageListToDataArray: <ResponseData>(dto?: InfiniteData<ApiDto.PaginatedList<ResponseData>>) => {
    return dto?.pages.flatMap(page => page.items) || [];
  },

  getTeamKey: (teamId: number) => ['team', teamId] as const,
};
