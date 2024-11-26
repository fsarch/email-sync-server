import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FsarchModule } from './fsarch/fsarch.module';
import { BaseTables1720373216667 } from './database/migrations/1720373216667-base-tables';
import { Account } from './database/entities/account.entity';
import { Email } from './database/entities/email.entity';
import { EmailTag } from './database/entities/email-tag.entity';
import { EmailAddress } from './database/entities/email-address.entity';
import { Tag } from './database/entities/tag.entity';
import { ApiModule } from './api/api.module';
import { AccountsRepositoryModule } from './repositories/accounts-repository/accounts-repository.module';
import { EmailReceiver } from './database/entities/email-receiver.entity';

@Module({
  imports: [
    FsarchModule.register({
      auth: {},
      database: {
        entities: [Account, Email, EmailAddress, EmailReceiver, EmailTag, Tag],
        migrations: [BaseTables1720373216667],
      },
    }),
    ApiModule,
    AccountsRepositoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
