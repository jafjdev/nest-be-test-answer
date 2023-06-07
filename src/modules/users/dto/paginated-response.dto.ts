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
    this.limit = parseInt(this.limit as any);
    this.page = parseInt(this.page as any);
    this.sort = parseInt(this.sort as any);
  }
}
