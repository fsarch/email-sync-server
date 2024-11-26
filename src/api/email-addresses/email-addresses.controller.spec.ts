import { Test, TestingModule } from '@nestjs/testing';
import { EmailAddressesController } from './email-addresses.controller';

describe('EmailAddressesController', () => {
  let controller: EmailAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailAddressesController],
    }).compile();

    controller = module.get<EmailAddressesController>(EmailAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
