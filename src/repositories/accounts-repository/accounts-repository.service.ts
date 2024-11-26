import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "../../database/entities/account.entity";
import { Repository } from "typeorm";
import { AccountCreateDto, AccountDto } from "../../models/account.model";

@Injectable()
export class AccountsRepositoryService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  public async List(): Promise<Array<Account>> {
    return this.accountRepository.find();
  }

  public async GetById(id: string): Promise<Account> {
    return this.accountRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async Create(
    accountDto: AccountCreateDto,
  ): Promise<Pick<AccountDto, 'id'>> {
    const id = crypto.randomUUID();

    const createdAccount = this.accountRepository.create({
      id,
      ...accountDto,
    });

    const savedAccount = await this.accountRepository.save(createdAccount);

    return {
      id: savedAccount.id,
    };
  }
}
