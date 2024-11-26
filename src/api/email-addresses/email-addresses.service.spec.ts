import { Test, TestingModule } from '@nestjs/testing';
import { EmailAddressesService } from './email-addresses.service';

describe('EmailAddressesService', () => {
  let service: EmailAddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailAddressesService],
    }).compile();

    service = module.get<EmailAddressesService>(EmailAddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
