import {
  IsString,
  IsOptional,
  IsInt,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateBetDto {
  @IsInt()
  readonly user_id: number;

  @IsInt()
  readonly bets_id: number;

  @IsInt()
  readonly odd: number;

  @IsInt()
  readonly amount: number;

  @ApiProperty({ description: 'open / won / lost' })
  @IsString()
  readonly state: string;

  @IsOptional()
  readonly deleted: number;
}

export class UpdateBetDto extends PartialType(CreateBetDto) { }