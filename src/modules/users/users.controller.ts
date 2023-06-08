import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { ParseMongoObjectIdPipe } from 'src/pipes/parse-mongo-object-id.pipe';
import { CsvParser } from 'src/providers/csv-parser.provider';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadUsersResponseDto } from './dto/upload-users-response.dto';
import { UsersInterceptor } from './interceptors/users.interceptor';
import { User } from './schema/user.schema';
import { UsersService } from './users.service';
import { ApiOkResponsePaginated } from '../../decorators/api-ok-response-paginated.decorator';
import { PaginatedResponseDto } from './dto/paginated-response.dto';

@ApiTags('Users API')
@Controller('users')
@UseInterceptors(UsersInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  @ApiOperation({ summary: `Create a new user` })
  @ApiOkResponse({ type: User })
  @ApiResponse({
    status: 422,
    description: 'UnprocessableEntityException',
    schema: {
      example: {
        statusCode: 422,
        message: 'User with email {email} already exists',
        error: 'Unprocessable Entity',
      },
    },
  })
  async postUsers(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.createUser(body);
  }

  @Get('/')
  @ApiOperation({ summary: `Return a list of users` })
  @ApiOkResponse({ type: ApiOkResponsePaginated(User) })
  async getUsers(
    @Query() query: QueryUserDto,
  ): Promise<PaginatedResponseDto<User>> {
    const users = await this.usersService.getUsers(query);

    return new PaginatedResponseDto<User>({
      data: users,
      limit: query.limit,
      page: query.page,
      sort: query.sort,
      sortBy: query.sortBy,
    });
  }

  @Patch('/:id')
  @ApiOperation({ summary: `Update a single user` })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Bad Request || Invalid ObjectId',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'NotFoundException',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id {id} not found',
        error: 'User Not Found',
      },
    },
  })
  async patchUser(
    @Param('id', ParseMongoObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, body);
  }

  @Delete('/:id')
  @ApiOperation({ summary: `Soft delete a single user` })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: User })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: 400,
        message: 'Bad Request || Invalid ObjectId',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'NotFoundException',
    schema: {
      example: {
        statusCode: 404,
        message: 'User with id {id} not found',
        error: 'User Not Found',
      },
    },
  })
  async deleteUser(
    @Param('id', ParseMongoObjectIdPipe) id: Types.ObjectId,
  ): Promise<User> {
    return this.usersService.softDelete(id);
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      // Allow only CSV mimetypes
      fileFilter: (req, file, callback) => {
        if (!file.mimetype?.match(/text\/csv/i)) {
          return callback(null, false);
        }
        callback(null, true);
      },
      storage: diskStorage({
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadUsers(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<UploadUsersResponseDto> {
    if (!file) {
      throw new UnprocessableEntityException(
        'Uploaded file is not a CSV file.',
      );
    }
    const usersCSV = await CsvParser.parse(file.path);
    const count = await this.usersService.uploadUsers(usersCSV);
    return new UploadUsersResponseDto(count);
  }
}
