import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsPositive,
  IsOptional,
  IsInt,
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsInt()
  readonly user_id: number;

  @ApiProperty({ description: 'Amount' })
  @IsInt()
  readonly amount: number;

  @ApiProperty({ description: 'selection deposit, withdraw, bet, winning' })
  @IsString()
  readonly category: string;

  @ApiProperty({ description: 'selection active / cancelled / settled' })
  @IsString()
  readonly status: string;

  @IsOptional()
  readonly deleted?: number;

  @IsString()
  readonly user_bet_id: string;
}

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) { }
