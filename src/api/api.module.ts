import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module';
import { EmailAddressesModule } from './email-addresses/email-addresses.module';

@Module({
  imports: [AccountsModule, EmailAddressesModule]
})
export class ApiModule {}
