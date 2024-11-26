import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountCreateDto, AccountDto } from '../../models/account.model';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../fsarch/uac/decorators/roles.decorator';
import { Role } from '../../fsarch/auth/role.enum';
import { AccountsRepositoryService } from '../../repositories/accounts-repository/accounts-repository.service';

@ApiTags('accounts')
@Controller({
  path: 'accounts',
  version: '1',
})
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsRepositoryService) {}

  @Get()
  @Roles(Role.manage)
  public async List() {
    const accounts = await this.accountsService.List();

    return accounts.map(AccountDto.FromDbo);
  }

  @Post()
  @Roles(Role.manage)
  public async Create(@Body() accountDto: AccountCreateDto) {
    return await this.accountsService.Create(accountDto);
  }
}
