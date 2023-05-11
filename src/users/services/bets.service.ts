import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bets } from '../entities/bets.entity';
import { CreateBetsDto, UpdateBetsDto } from '../dtos/bets.dto';

import { Bet } from 'src/users/entities/bet.entity';
import { Transaction } from '../entities/transactions.entity';

@Injectable()
export class BetsService {
  constructor(
    @InjectRepository(Bets) private betsRepo: Repository<Bets>,
    @InjectRepository(Bet) private betRepo: Repository<Bet>,
    @InjectRepository(Transaction) private tranRepo: Repository<Transaction>,
  ) { }

  findAll() {
    return this.betsRepo.find();
  }

  async findOne(id: number) {
    const Bets = await this.betsRepo.findOneBy({ id });
    if (!Bets) {
      throw new NotFoundException('not found');
    }
    return Bets;
  }

  async getBestByFilter(nameFilter) {
    const BestFilter = await this.betsRepo.find({
      where: [
        { sport: nameFilter },
        { event_id: nameFilter },
      ],
    })
    return BestFilter;
  }

  async create(data: CreateBetsDto) {
    const Bets = this.betsRepo.create(data);
    return this.betsRepo.save(Bets);
  }

  async update(id: number, changes: UpdateBetsDto) {
    try {
      const Bets = await this.findOne(id);
      this.betsRepo.merge(Bets, changes);
      return this.betsRepo.save(Bets);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.CONFLICT,
        error: 'CONFLICT',
      }, HttpStatus.CONFLICT, {
        cause: error
      });
    }
  }


  async patchResultBets(id: number, changes: UpdateBetsDto) {
    try {
      const user = await this.betsRepo.findOneBy({ id: id });
      if (!user) {
        throw new HttpException('Error', HttpStatus.CONFLICT);
      }
      // update bets result field = won
      await this.betsRepo.update({ id }, { status: changes.status, result: changes.result });
      const BestFilter = await this.betRepo.find({
        where: {
          bets_id: id,
          state: "open"
        }
      });
      for (const bet of BestFilter) {
        let Sum = bet.odd * bet.amount;
        // update values in bet
        this.betRepo.update({ id: bet.id }, { state: changes.result, amount: Sum });
          const dataTran = {
            user_id: bet.user_id,
            amount: Sum,
            category: "winning",
            status: "settled",
            user_bet_id: "winning"
          }
          // create Object
          const newDataTran = this.tranRepo.create(dataTran);
          this.tranRepo.save(newDataTran);
      }
      return {
        id: id,
        status: HttpStatus.OK,
        message: "OK"
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'FORBIDDEN',
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }

  async patchchangeBetsStatus(id: number, changes: UpdateBetsDto) {
    const bets = await this.betsRepo.findOneBy({ id: id });
    if (!bets) {
      throw new HttpException('not fount best', HttpStatus.CONFLICT);
    }
    if (bets.status == 'cancelled' && changes.status != 'active' ) {
      const statusUpdate = await this.betsRepo.update({ id }, { status: changes.status });
      if (statusUpdate.affected === 1) {
        throw new HttpException(`record ${id} Updated successfully`, HttpStatus.OK);
      }
    } else {
      throw new HttpException('best in canceled cannot be activated', HttpStatus.NOT_FOUND);
    }
  }

  remove(id: number) {
    return this.betsRepo.delete(id);
  }
}