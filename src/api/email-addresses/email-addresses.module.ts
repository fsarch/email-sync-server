import { Module } from '@nestjs/common';
import { EmailAddressesService } from './email-addresses.service';
import { EmailAddressesController } from './email-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAddress } from '../../database/entities/email-address.entity';

@Module({
  providers: [EmailAddressesService],
  exports: [EmailAddressesService],
  controllers: [EmailAddressesController],
  imports: [TypeOrmModule.forFeature([EmailAddress])],
})
export class EmailAddressesModule {}
