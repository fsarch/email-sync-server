import { Test, TestingModule } from '@nestjs/testing';
import { AccountsRepositoryService } from './accounts-repository.service';

describe('AccountsRepositoryService', () => {
  let service: AccountsRepositoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsRepositoryService],
    }).compile();

    service = module.get<AccountsRepositoryService>(AccountsRepositoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
