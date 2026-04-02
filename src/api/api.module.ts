import { Module } from '@nestjs/common';
import { AccountsModule } from './accounts/accounts.module.js';
import { EmailAddressesModule } from './email-addresses/email-addresses.module.js';

@Module({
  imports: [AccountsModule, EmailAddressesModule]
})
export class ApiModule {}
