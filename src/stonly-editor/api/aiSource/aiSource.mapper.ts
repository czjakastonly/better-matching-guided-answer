import type { AiSourceDto } from 'stonly-editor/api/aiSource/aiSource.dto';
import type { AiSourceModel } from 'stonly-editor/model/aiSource/aiSource.model';
import { type AiSourceStatusType, type AiSourceType } from 'stonly-editor/model/aiSource/aiSource.enum';
import { uniq } from 'lodash';
import { type ApiDto } from '../api.dto';

export const AiSourceApiMapper = {
  toAiSource: (dto: AiSourceDto.AiSource): AiSourceModel.AiSource => ({
    ...dto,
    type: dto.type as AiSourceType,
    status: dto.status as AiSourceStatusType,
    properties: { ...dto.properties },
    languageList: dto.languageList?.split(',') || [],
    guideLanguageList: uniq(dto.guideLanguages?.split(',')),
  }),
  toAiSourceElement: (dto: AiSourceDto.AiSourceElement): AiSourceModel.AiSourceElement => ({
    ...dto,
    status: dto.status as AiSourceStatusType,
  }),
  toAiSourcePagedList: (
    dto: ApiDto.PaginatedList<AiSourceDto.AiSource>
  ): ApiDto.PaginatedList<AiSourceModel.AiSource> => ({
    ...dto,
    items: dto.items.map(AiSourceApiMapper.toAiSource),
  }),
  toAiSourceElementPagedList: (
    dto: ApiDto.PaginatedList<AiSourceDto.AiSourceElement>
  ): ApiDto.PaginatedList<AiSourceModel.AiSourceElement> => ({
    ...dto,
    items: dto.items.map(AiSourceApiMapper.toAiSourceElement),
  }),
  toFirstAiSource: (dto: ApiDto.PaginatedList<AiSourceDto.AiSource>): AiSourceModel.AiSource | null =>
    dto.items[0] ? AiSourceApiMapper.toAiSource(dto.items[0]) : null,
  toAiSearchSourceId: (dto: AiSourceDto.CreatedAiSource): number => dto.searchSourceId,
};
