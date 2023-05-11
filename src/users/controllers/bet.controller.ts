import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { BetService } from '../services/bet.service';
import { CreateBetDto, UpdateBetDto } from './../dtos/bet.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Bet')
@Controller('bet')
export class BetController {
  constructor(private Service: BetService) {}


  @ApiOperation({ summary: 'All Bets' })
  @Get()
  findAll() {
    return this.Service.findAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.Service.findOne(id);
  }

  @ApiOperation({ summary: 'Create bet by user' })
  @Post()
  create(@Body() payload: CreateBetDto) {
    return this.Service.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBetDto
  ) {
    return this.Service.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.Service.remove(+id);
  }
}