import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../database/entities/account.entity';

export class AccountMetaDto {
  @ApiProperty()
  color?: string;
}

export class AccountAuthBasicOptionsDto {
  @ApiProperty()
  type: 'basic';

  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

export class AccountInboxOptionsDto {
  public static FromDbo(data: any) {
    const inboxOptions = new AccountInboxOptionsDto();

    inboxOptions.type = data.type;
    inboxOptions.host = data.host;
    inboxOptions.port = data.port;
    inboxOptions.tls = data.tls;

    return inboxOptions;
  }

  @ApiProperty()
  type: 'imap';

  @ApiProperty()
  auth: AccountAuthBasicOptionsDto;

  @ApiProperty()
  host: string;

  @ApiProperty()
  port: number;

  @ApiProperty()
  tls: boolean;
}

export class AccountOutboxOptionsDto {
  public static FromDbo(data: any) {
    const inboxOptions = new AccountOutboxOptionsDto();

    inboxOptions.type = data.type;
    inboxOptions.host = data.host;
    inboxOptions.port = data.port;
    inboxOptions.tls = data.tls;

    return inboxOptions;
  }

  @ApiProperty()
  type: 'smtp';

  @ApiProperty()
  auth: AccountAuthBasicOptionsDto;

  @ApiProperty()
  host: string;

  @ApiProperty()
  port: number;

  @ApiProperty()
  tls: boolean;
}

export class AccountOptionsDto {
  public static FromDbo(data: Record<string, any>) {
    const accountOptions = new AccountOptionsDto();

    accountOptions.inbox = AccountInboxOptionsDto.FromDbo(data.inbox);
    accountOptions.outbox = AccountOutboxOptionsDto.FromDbo(data.outbox);

    return accountOptions;
  }

  @ApiProperty()
  inbox: AccountInboxOptionsDto;

  @ApiProperty()
  outbox: AccountOutboxOptionsDto;

  @ApiProperty()
  eMailAddress: string;
}

export class AccountCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  meta: AccountMetaDto;

  @ApiProperty()
  options: AccountOptionsDto;
}

export class AccountDto {
  public static FromDbo(account: Account) {
    const dto = new AccountDto();

    dto.id = account.id;
    dto.name = account.name;
    dto.alias = account.alias;
    dto.meta = account.meta;
    dto.options = AccountOptionsDto.FromDbo(account.options);

    return dto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  meta: AccountMetaDto;

  @ApiProperty()
  options: AccountOptionsDto;
}
