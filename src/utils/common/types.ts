import { ApiProperty } from '@nestjs/swagger';

export interface IPageable {
  limit: number;
  offset: number;
}

export interface IPageableCount {
  total: number;
  pageNumber: number;
  pageTotal: number;
  limit: number;
  offset: number;
}

export interface IPageableResponse<T> {
  data: Array<T>;
  pageable: IPageableCount;
}

export class IPageableDto<T> implements IPageableResponse<T> {
  @ApiProperty()
  data: Array<T>;

  @ApiProperty()
  pageable: IPageableCount;
}

export class PageableCountDto implements IPageableCount {
  @ApiProperty()
  total: number;

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  pageTotal: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class DeleteResultDto {
  @ApiProperty({
    description:
      'Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined.',
  })
  acknowledged: boolean;

  @ApiProperty({ description: 'The number of documents that were deleted' })
  deletedCount: number;
}
