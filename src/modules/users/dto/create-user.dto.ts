import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../schema/user.schema';
import { Prop } from '@nestjs/mongoose';

export class CreateUserDto extends User {
  @ApiProperty({
    required: true,
  })
  @IsDateString()
  birthDate: Date;

  @ApiProperty({
    required: true,
  })
  @Prop({ required: true })
  @IsDefined()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    required: true,
  })
  @Prop({ required: true })
  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    required: true,
  })
  @Prop({ required: true })
  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: true,
  })
  @Prop({ required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  createdAt: Date;

  constructor(args?: Partial<CreateUserDto>) {
    super();
    Object.assign(this, args);
  }
}
