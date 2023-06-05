import { ApiResponseProperty } from '@nestjs/swagger';
import {
  IPaginatedResponse,
  PaginatedResponseSortEnum,
} from '../interfaces/paginated-response.interface';

export class PaginatedResponseDto<T> implements IPaginatedResponse<T> {
  data: T[];

  @ApiResponseProperty()
  limit: number;

  @ApiResponseProperty()
  page: number;

  @ApiResponseProperty()
  sort: PaginatedResponseSortEnum;

  @ApiResponseProperty()
  sortBy: string;

  constructor(args?: PaginatedResponseDto<T>) {
    Object.assign(this, args);
  }
}
