import {
  IsString,
  IsInt,
  IsOptional
} from 'class-validator';
import { PartialType, ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Bets')
export class CreateBetsDto {
  @ApiProperty({ description: 'Number bet' })
  @IsInt()
  readonly bet_option: number;

  @ApiProperty({ description: 'Sport = Soccer ...' })
  @IsString()
  readonly sport: string;

  @ApiProperty({ description: 'selection active / cancelled / settled' })
  @IsString()
  readonly status: string;

  @IsString()
  readonly name: string;

  @IsInt()
  readonly event_id: number;

  @IsInt()
  readonly odd: number;

  @ApiProperty({ description: 'selection won / lost' })
  @IsString()
  @IsOptional()
  readonly result: string;
}

export class UpdateBetsDto extends PartialType(CreateBetsDto) { }