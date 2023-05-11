import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bet } from '../entities/bet.entity';
import { CreateBetDto, UpdateBetDto } from '../dtos/bet.dto';

import { User } from '../entities/users.entity';
import { Transaction } from '../entities/transactions.entity';
import { TransactionsService } from './transactions.service';
import { BetsService } from '../services/bets.service';

@Injectable()
export class BetService {
  constructor(
    @InjectRepository(Bet) private betRepo: Repository<Bet>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Transaction) private TranRepo: Repository<Transaction>,
    private transactionsService: TransactionsService,
    private betsService: BetsService,
  ) { }

  findAll() {
    return this.betRepo.find();
  }

  async findOne(id: number) {
    const bet = await this.betRepo.findOneBy({ id: id });
    if (!bet) {
      throw new NotFoundException(`bet #${id} not found`);
    }
    return bet;
  }

  async create(data: CreateBetDto) {
    try {
      const newBet = this.betRepo.create(data);
      const user = await this.userRepo.findOneBy({ id: data.user_id });
      if (!user) {
        throw new HttpException('User Not Fount', HttpStatus.NOT_FOUND);
      }
      const idBets: number = data.bets_id;
      const notbet = await this.betsService.findOne(idBets);
      if (notbet.result == "active") {
        let balance = await this.transactionsService.getBalanceUSer(data.user_id);
        if (balance.amount > 0) {
          this.betRepo.save(newBet);
          const dataBet = {
            user_id: data.user_id,
            amount: data.amount,
            category: "Bet",
            status: "active",
            user_bet_id: "Bet",
          }
          const newDataBet = this.TranRepo.create(dataBet);
          return this.TranRepo.save(newDataBet);
        } else {
          throw new HttpException('you have no credit for the bet', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException('You cannot bet on canceled / settled bets', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.CONFLICT);
    }
  }

  async update(id: number, changes: UpdateBetDto) {
    const Bet = await this.betRepo.findOneBy({ id });
    if (!Bet) {
      throw new HttpException('Bet Not Fount', HttpStatus.NOT_FOUND);
    }
    this.betRepo.merge(Bet, changes);
    return this.betRepo.save(Bet);
  }

  remove(id: number) {
    return this.betRepo.delete(id);
  }
}