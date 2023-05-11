import { Injectable, NotFoundException, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { Transaction } from '../entities/transactions.entity';
import { CreateTransactionDto, UpdateTransactionDto } from '../dtos/transactions.dto';

import { User } from 'src/users/entities/users.entity';



@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private RepoTran: Repository<Transaction>,
    @InjectRepository(User) private RepUser: Repository<User>,
  ) { }

  findAll() {
    return this.RepoTran.find();
  }

  async findOne(id: number) {
    const tran = await this.RepoTran.findOneBy({ id });
    if (!tran) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return tran;
  }

  async create(data: CreateTransactionDto) {
    const newTran = this.RepoTran.create(data);
    return this.RepoTran.save(newTran);
  }

  async update(id: number, changes: UpdateTransactionDto) {
    const tran = await this.findOne(id);
    this.RepoTran.merge(tran, changes);
    return this.RepoTran.save(tran);
  }

  async updateDeposit(changes: UpdateTransactionDto) {
    try {
      const User = await this.RepUser.findOneBy({ id: changes.user_id });
      if (!User) {
        throw new NotFoundException(`User #${changes.user_id} not found`);
      }
      const depositdata = {
        amount: changes.amount,
        user_id: changes.user_id,
        user_bet_id: "Deposit",
        category: "Deposit",
        status: "Deposit"
      }
      const newDeposit = this.RepoTran.create(depositdata);
      this.RepoTran.save(newDeposit);
      return {
        id: changes.user_id,
        status: "200",
        message: "Deposit OK"
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

  async updateWithdraw(changes: UpdateTransactionDto) {
    try {
      const User = await this.RepUser.findOneBy({ id: changes.user_id });
      if (!User) {
        throw new NotFoundException(`User #${changes.user_id} not found`);
      }
      const withdrawdata = {
        amount: changes.amount,
        user_id: changes.user_id,
        user_bet_id: "withdraw",
        category: "withdraw",
        status: "withdraw"
      }
      const newwithdraw = this.RepoTran.create(withdrawdata);
      this.RepoTran.save(newwithdraw);
      return {
        id: changes.user_id,
        status: "200",
        message: "Withdraw OK"
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

  async addition(idUser: number, value: string) {
    const addition = await this.RepoTran
    .createQueryBuilder("transaction")
    .select('SUM(transaction.amount)', 'addition')
    .where("transaction.user_id= :Id", { Id: idUser })
    .andWhere("transaction.category = :category", { category: value })
    .getRawMany()
    return parseInt(addition[0]['addition']);
  }
  async getBalanceUSer(idUser: number) {
    try {
      const User = await this.RepUser.findOneBy({ id: idUser });
      if (!User) {
        throw new NotFoundException(`User #${idUser} not found`);
      }
      // (deposit+winning) - (withdraw+bet)
      let dep = isNaN(await this.addition(idUser, "deposit")) ? 0 : await this.addition(idUser, "deposit")
      let win = isNaN(await this.addition(idUser, "winning")) ? 0 : await this.addition(idUser, "winning")
      let wit = isNaN(await this.addition(idUser, "withdraw")) ? 0 : await this.addition(idUser, "withdraw")
      let bet = isNaN(await this.addition(idUser, "bet")) ? 0 : await this.addition(idUser, "bet")
      let balance = ((dep + win) - (wit + bet))
      return {
        user_id: idUser,
        amount: balance,
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



  remove(id: number) {
    return this.RepoTran.delete(id);
  }

  async getTransactionByUser(id: number, filter: any) {
    const tran = await this.RepoTran.find({
      where: { user_id: id, category: filter }
    })
    return tran;
  }

}
