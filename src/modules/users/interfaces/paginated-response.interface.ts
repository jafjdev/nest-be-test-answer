export enum PaginatedResponseSortEnum {
  ASC = 1,
  DESC = -1,
}

export interface IPaginatedResponse<T> {
  data: T[];
  limit: number;
  page: number;
  sort: PaginatedResponseSortEnum;
  sortBy: string;
}
