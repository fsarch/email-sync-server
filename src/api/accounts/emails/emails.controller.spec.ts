import { Test, TestingModule } from '@nestjs/testing';
import { EmailsController } from './emails.controller.js';
import { EmailsService } from './emails.service.js';

describe('EmailsController', () => {
  let controller: EmailsController;
  let emailsService: {
    List: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    emailsService = {
      List: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailsController],
      providers: [
        {
          provide: EmailsService,
          useValue: emailsService,
        },
      ],
    }).compile();

    controller = module.get<EmailsController>(EmailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return items with meta', async () => {
    emailsService.List.mockResolvedValue({
      items: [
        {
          id: 'email-1',
          accountId: 'account-1',
          senderEmailAddressId: 'sender-1',
          replyEmailAddressId: 'reply-1',
          subject: 'Invoice',
          creationTime: '2026-04-05T08:00:00.000Z',
          readTime: null,
          sendTime: null,
          deletionTime: null,
        },
      ],
      total: 1,
      page: 2,
      limit: 10,
    });

    const result = await controller.List('account-1', 2, 10, 'invoice');

    expect(emailsService.List).toHaveBeenCalledWith('account-1', {
      page: 2,
      limit: 10,
      search: 'invoice',
      sort: undefined,
    });
    expect(result.meta).toEqual({
      total: 1,
      page: 2,
      limit: 10,
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe('email-1');
  });

  it('should reject page lower than 1', async () => {
    await expect(controller.List('account-1', 0, 10)).rejects.toThrow(
      'page must be >= 1',
    );
  });

  it('should reject limit outside range', async () => {
    await expect(controller.List('account-1', 1, 101)).rejects.toThrow(
      'limit must be between 1 and 100',
    );
  });

  it('should parse sort and pass it to service', async () => {
    emailsService.List.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 25,
    });

    await controller.List('account-1', 1, 25, undefined, 'asc:subject');

    expect(emailsService.List).toHaveBeenCalledWith('account-1', {
      page: 1,
      limit: 25,
      search: undefined,
      sort: {
        direction: 'ASC',
        field: 'subject',
      },
    });
  });

  it('should reject invalid sort format', async () => {
    await expect(controller.List('account-1', 1, 25, undefined, 'subject:asc')).rejects.toThrow(
      'sort must match "asc:subject", "desc:creationTime" or "asc:sendTime"',
    );
  });

  it('should parse sendTime sort option', async () => {
    emailsService.List.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 25,
    });

    await controller.List('account-1', 1, 25, undefined, 'asc:sendTime');

    expect(emailsService.List).toHaveBeenCalledWith('account-1', {
      page: 1,
      limit: 25,
      search: undefined,
      sort: {
        direction: 'ASC',
        field: 'sendTime',
      },
    });
  });

  it('should allow search and sort to be undefined', async () => {
    emailsService.List.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 25,
    });

    await controller.List('account-1', 1, 25);

    expect(emailsService.List).toHaveBeenCalledWith('account-1', {
      page: 1,
      limit: 25,
      search: undefined,
      sort: undefined,
    });
  });
});
