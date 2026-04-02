import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service.js';
import { EmailsController } from './emails.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from '../../../database/entities/email.entity.js';
import { EmailAddressesModule } from '../../email-addresses/email-addresses.module.js';
import { EmailReceiver } from '../../../database/entities/email-receiver.entity.js';
import { AccountsRepositoryModule } from '../../../repositories/accounts-repository/accounts-repository.module.js';

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
