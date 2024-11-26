import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from '../../../database/entities/email.entity';
import { EmailAddressesModule } from '../../email-addresses/email-addresses.module';
import { EmailReceiver } from '../../../database/entities/email-receiver.entity';
import { AccountsRepositoryModule } from '../../../repositories/accounts-repository/accounts-repository.module';

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
