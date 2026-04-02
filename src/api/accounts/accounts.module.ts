import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller.js';
import { EmailsModule } from './emails/emails.module.js';
import { AccountsRepositoryModule } from '../../repositories/accounts-repository/accounts-repository.module.js';

@Module({
  controllers: [AccountsController],
  imports: [EmailsModule, AccountsRepositoryModule],
})
export class AccountsModule {}
