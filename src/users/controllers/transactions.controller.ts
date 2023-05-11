import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto, UpdateTransactionDto } from '../dtos/transactions.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';


@UseGuards(JwtAuthGuard)
@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private Service: TransactionsService) {}

  @ApiOperation({ summary: 'List all Transactions' })
  @Get()
  findAll() {
    return this.Service.findAll();
  }

  @ApiOperation({ summary: 'Optional: deposit, withdraw, bet, winning' })
  @Get('user/:id?/:filter?')
  getTransactionByUser(@Param('id', ParseIntPipe) id: number, @Param('filter') filter: any,) {

    return this.Service.getTransactionByUser(id, filter);
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return this.Service.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() payload: CreateTransactionDto) {
    return this.Service.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateTransactionDto
  ) {
    return this.Service.update(id, payload);
  }

  @Patch('deposit/')
  updateDeposit(
    @Body() payload: UpdateTransactionDto
  ) {
    return this.Service.updateDeposit(payload);
  }

  @Patch('withdraw/')
  updateWithdraw(
    @Body() payload: UpdateTransactionDto
  ) {
    return this.Service.updateWithdraw(payload);
  }

  @Get('balance-user/:id')
  getBalanceUSer(@Param('id', ParseIntPipe) idUser: number) {
    return this.Service.getBalanceUSer(idUser);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.Service.remove(+id);
  }
}
