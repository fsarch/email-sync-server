import { Body, Controller, Get, NotFoundException, Param, Post, BadRequestException } from '@nestjs/common';
import { AccountCreateDto, AccountDto } from '../../models/account.model.js';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../fsarch/uac/decorators/roles.decorator.js';
import { Role } from '../../fsarch/auth/role.enum.js';
import { AccountsRepositoryService } from '../../repositories/accounts-repository/accounts-repository.service.js';
import { ImapSyncService } from './imap-sync/imap-sync.service.js';

@ApiTags('accounts')
@Controller({
  path: 'accounts',
  version: '1',
})
@ApiBearerAuth()
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsRepositoryService,
    private readonly imapSyncService: ImapSyncService,
  ) {}

  @Get()
  @Roles(Role.manage)
  @ApiOkResponse({
    type: AccountDto,
    isArray: true,
  })
  public async List() {
    const accounts = await this.accountsService.List();

    return accounts.map(AccountDto.FromDbo);
  }

  @Get(':accountId')
  @Roles(Role.manage)
  @ApiOkResponse({
    type: AccountDto,
  })
  @ApiNotFoundResponse({
    description: 'Account wurde nicht gefunden',
  })
  public async Get(@Param('accountId') accountId: string) {
    const account = await this.accountsService.GetById(accountId);

    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    return AccountDto.FromDbo(account);
  }

  @Post()
  @Roles(Role.manage)
  public async Create(@Body() accountDto: AccountCreateDto) {
    return await this.accountsService.Create(accountDto);
  }

  @Post(':accountId/sync')
  @Roles(Role.manage)
  @ApiOkResponse({
    description: 'Synchronisierung der Emails erfolgreich gestartet',
  })
  @ApiNotFoundResponse({
    description: 'Account wurde nicht gefunden',
  })
  public async SyncEmails(@Param('accountId') accountId: string) {
    const account = await this.accountsService.GetById(accountId);

    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    try {
      await this.imapSyncService.SyncEmails(accountId);
      return {
        message: `Emails für Account ${accountId} erfolgreich synchronisiert`,
        accountId,
      };
    } catch (error) {
      throw new BadRequestException(
        `Fehler bei der Synchronisierung: ${error.message}`,
      );
    }
  }
}
