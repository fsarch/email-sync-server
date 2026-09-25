import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AccountsRepositoryModule } from './repositories/accounts-repository/accounts-repository.module.js';

@Module({
  imports: [ApiModule, AccountsRepositoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
