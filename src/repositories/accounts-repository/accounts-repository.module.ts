import { Module } from '@nestjs/common';
import { AccountsRepositoryService } from './accounts-repository.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../database/entities/account.entity.js';

@Module({
  providers: [AccountsRepositoryService],
  imports: [TypeOrmModule.forFeature([Account])],
  exports: [AccountsRepositoryService],
})
export class AccountsRepositoryModule {}
