import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { PaginatedResponseSortEnum } from '../interfaces/paginated-response.interface';
import { User } from '../schema/user.schema';

export class QueryUserDto extends PartialType(User) {
  @ApiProperty({
    default: 20,
    description: `Number of users to return`,
    required: false,
  })
  limit: number = 20;

  @ApiProperty({
    default: 1,
    description: `Current page of users`,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({
    default: PaginatedResponseSortEnum.DESC,
    description: `Sort order. Desc/Newest = -1, Asc/Oldest = 1`,
    enum: PaginatedResponseSortEnum,
    required: false,
  })
  @IsEnum(PaginatedResponseSortEnum)
  @IsOptional()
  @Type(() => Number)
  sort: PaginatedResponseSortEnum = PaginatedResponseSortEnum.DESC;

  @ApiProperty({
    default: 'createdAt',
    description: `User field to sort by`,
    required: false,
  })
  sortBy: string = 'createdAt';

  constructor(args?: Partial<QueryUserDto>) {
    super();
    Object.assign(this, args);
  }
}
