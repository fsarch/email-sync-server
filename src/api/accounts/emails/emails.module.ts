import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from '../../../database/entities/email.entity.js';
import { EmailReceiver } from '../../../database/entities/email-receiver.entity.js';
import { AccountsRepositoryModule } from '../../../repositories/accounts-repository/accounts-repository.module.js';
import { EmailAddressesModule } from '../../email-addresses/email-addresses.module.js';
import { EmailsController } from './emails.controller.js';
import { EmailsService } from './emails.service.js';

@Module({
  providers: [EmailsService],
  controllers: [EmailsController],
  imports: [
    TypeOrmModule.forFeature([Email]),
    TypeOrmModule.forFeature([EmailReceiver]),
    EmailAddressesModule,
    AccountsRepositoryModule,
  ],
})
export class EmailsModule {}
