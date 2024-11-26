import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { EmailsModule } from './emails/emails.module';
import { AccountsRepositoryModule } from '../../repositories/accounts-repository/accounts-repository.module';

@Module({
  controllers: [AccountsController],
  imports: [EmailsModule, AccountsRepositoryModule],
})
export class AccountsModule {}
