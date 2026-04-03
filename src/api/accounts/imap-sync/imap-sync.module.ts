import { Module } from '@nestjs/common';
import { ImapSyncService } from './imap-sync.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from '../../../database/entities/email.entity.js';
import { AccountsRepositoryModule } from '../../../repositories/accounts-repository/accounts-repository.module.js';
import { EmailAddressesModule } from '../../email-addresses/email-addresses.module.js';

@Module({
  providers: [ImapSyncService],
  imports: [
    TypeOrmModule.forFeature([Email]),
    AccountsRepositoryModule,
    EmailAddressesModule,
  ],
  exports: [ImapSyncService],
})
export class ImapSyncModule {}

