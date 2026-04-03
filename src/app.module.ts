import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FsarchModule } from './fsarch/fsarch.module.js';
import { BaseTables1720373216667 } from './database/migrations/1720373216667-base-tables.js';
import { Account } from './database/entities/account.entity.js';
import { Email } from './database/entities/email.entity.js';
import { EmailTag } from './database/entities/email-tag.entity.js';
import { EmailAddress } from './database/entities/email-address.entity.js';
import { Tag } from './database/entities/tag.entity.js';
import { ApiModule } from './api/api.module.js';
import { AccountsRepositoryModule } from './repositories/accounts-repository/accounts-repository.module.js';
import { EmailReceiver } from './database/entities/email-receiver.entity.js';
import { AddImapMessageIdToEmail1775173532152 } from './database/migrations/1775173532152-add-imap-message-id.js';

@Module({
  imports: [
    FsarchModule.register({
      auth: {},
      database: {
        entities: [Account, Email, EmailAddress, EmailReceiver, EmailTag, Tag],
        migrations: [
          BaseTables1720373216667,
          AddImapMessageIdToEmail1775173532152,
        ],
      },
    }),
    ApiModule,
    AccountsRepositoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
