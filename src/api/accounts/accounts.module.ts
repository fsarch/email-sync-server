import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller.js';
import { EmailsModule } from './emails/emails.module.js';
import { AccountsRepositoryModule } from '../../repositories/accounts-repository/accounts-repository.module.js';
import { ImapSyncModule } from './imap-sync/imap-sync.module.js';

@Module({
  controllers: [AccountsController],
  imports: [EmailsModule, AccountsRepositoryModule, ImapSyncModule],
})
export class AccountsModule {}
