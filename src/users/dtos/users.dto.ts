import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}


export class CreateUserDto {
  @ApiProperty({ description: 'Nombre del email' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly password: string;

  @IsString()
  readonly role: string;
  @IsOptional()
  readonly first_name: string;
  @IsOptional()
  readonly last_name: string;
  @IsOptional()
  readonly phone: number;
  @IsOptional()
  readonly username: string;
  @IsOptional()
  readonly address: string;
  @IsOptional()
  readonly gender: string;
  @IsOptional()
  readonly birth_date: Date;
  @IsOptional()
  readonly country_id: number;
  @IsOptional()
  readonly city: string;
  @IsOptional()
  readonly category: TaskStatus;
  @IsOptional()
  readonly document_id: number;
  @IsOptional()
  readonly user_state: string;
  @IsOptional()
  readonly created_at: Date;
  @IsOptional()
  readonly updated_at: Date;
  @IsOptional()
  readonly deleted: number;
  @IsOptional()
  readonly deleted_at: Date;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }
