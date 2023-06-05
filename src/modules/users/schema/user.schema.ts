import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export const USERS_COLLECTION = 'users';

@Schema({
  collection: USERS_COLLECTION,
  timestamps: true,
})
export class User {
  @ApiResponseProperty()
  _id: Types.ObjectId;

  @ApiProperty({
    description: `User's birthdate`,
    example: new Date().toISOString(),
    required: false,
  })
  @Prop({ type: Date })
  birthDate: Date;

  @ApiResponseProperty()
  @Prop({ type: Date })
  createdAt: Date;

  @ApiProperty({
    description: `User's email address`,
    example: 'johnsmith@nestjs.com',
    required: false,
  })
  @Prop()
  email: string;

  @ApiProperty({
    description: `User's first name`,
    example: 'John',
    required: false,
  })
  @Prop()
  firstName: string;

  @Prop({ type: Boolean, default: null })
  isDeleted: boolean;

  @ApiProperty({
    description: `User's last name`,
    example: 'Smith',
    required: false,
  })
  @Prop()
  lastName: string;

  @ApiProperty({ required: false })
  @Prop()
  marketingSource: string;

  @ApiProperty({ required: false })
  @Prop({ required: true, index: true })
  phone: string;

  @ApiProperty({
    description: `User's status`,
    example: 'DQL',
    required: false,
  })
  @Prop()
  status: string;

  @ApiResponseProperty()
  @Prop({ type: Date })
  updatedAt: Date;

  constructor(args?: Partial<User>) {
    Object.assign(this, args);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
