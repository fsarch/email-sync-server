import { Module } from '@nestjs/common';
import { AccountsRepositoryService } from './accounts-repository.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../../database/entities/account.entity';

@Module({
  providers: [AccountsRepositoryService],
  imports: [TypeOrmModule.forFeature([Account])],
  exports: [AccountsRepositoryService],
})
export class AccountsRepositoryModule {}
