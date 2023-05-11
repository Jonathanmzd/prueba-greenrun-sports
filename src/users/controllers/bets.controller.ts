import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { BetsService } from '../services/bets.service';
import { CreateBetsDto, UpdateBetsDto } from './../dtos/bets.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Bets')
@Controller('bets')
export class BetsController {
  constructor(private Service: BetsService) {}

  @ApiOperation({ summary: 'Listar Todas las Apuestas.' })
  @Get()
  findAll() {
    return this.Service.findAll();
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.Service.findOne(id);
  }

  @ApiOperation({ summary: 'can be filtered by specific event or sport' })
  @Get('filters/:filter?')
  getBestByFilter( @Param('filter') nameFilter: string) {
    return this.Service.getBestByFilter(nameFilter);
  }

  @Post()
  create(@Body() payload: CreateBetsDto) {
    return this.Service.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBetsDto
  ) {
    return this.Service.update(id, payload);
  }

  @ApiOperation({ summary: 'won / lost' })
  @Patch('result/:id')
  patchResultBets(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBetsDto
  ) {
    return this.Service.patchResultBets(id, payload);
  }


  @ApiOperation({ summary: 'can be filtered by active/cancelled/settled' })
  @Patch('status/:id')
  patchchangeBetsStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBetsDto
  ) {
    return this.Service.patchchangeBetsStatus(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.Service.remove(+id);
  }
}