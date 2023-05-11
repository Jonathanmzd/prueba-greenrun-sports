import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/users.entity';

import { BetController } from './controllers/bet.controller';
import { BetService } from './services/bet.service';
import { Bet } from './entities/bet.entity';

import { BetsController } from './controllers/bets.controller';
import { BetsService } from './services/bets.service';
import { Bets } from './entities/bets.entity';

import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './services/transactions.service';
import { Transaction } from './entities/transactions.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Bet, Bets, Transaction])],
  controllers: [UsersController, BetController, BetsController, TransactionsController],
  providers: [ UsersService, BetService, BetsService, TransactionsService],
  exports: [UsersService],
})
export class UsersModule {}
