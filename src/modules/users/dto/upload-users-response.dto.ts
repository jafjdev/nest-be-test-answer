import { ApiResponseProperty } from '@nestjs/swagger';

export class UploadUsersResponseDto {
  @ApiResponseProperty()
  failedCount: number;

  @ApiResponseProperty()
  successCount: number;

  constructor(args: UploadUsersResponseDto) {
    Object.assign(this, args);
  }
}
