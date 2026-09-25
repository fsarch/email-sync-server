import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAddress } from '../../database/entities/email-address.entity.js';
import { EmailAddressesController } from './email-addresses.controller.js';
import { EmailAddressesService } from './email-addresses.service.js';

@Module({
  providers: [EmailAddressesService],
  exports: [EmailAddressesService],
  controllers: [EmailAddressesController],
  imports: [TypeOrmModule.forFeature([EmailAddress])],
})
export class EmailAddressesModule {}
