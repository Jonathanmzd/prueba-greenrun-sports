import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/users.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) { }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const newUser = this.userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    return this.userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    if (user.role == 'admin') {
      throw new HttpException('administrator cannot be update by another administrator', HttpStatus.CONFLICT);
    }
    this.userRepo.merge(user, changes);
    return this.userRepo.save(user);
  }

  async blockUser(id: number, changes: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (user.role == 'admin') {
      throw new HttpException('administrator cannot be blocked by another administrator', HttpStatus.CONFLICT);
    }
    if (!user) {
      throw new HttpException('Error', HttpStatus.CONFLICT);
    }
    const statusUpdate = await this.userRepo.update({ id }, { user_state: changes.user_state });
    if (statusUpdate.affected === 1) {
      throw new HttpException(`record ${id} Updated successfully`, HttpStatus.OK);
    }
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({
      where: {
        email
      }
    })
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

}
