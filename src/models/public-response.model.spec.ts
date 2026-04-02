import { AccountDto } from './account.model.js';
import { EmailListDto, EmailSingleDto } from './email.model.js';

describe('public response mappings', () => {
  it('maps accounts without exposing credentials', () => {
    const account = {
      id: 'account-1',
      name: 'Main Account',
      alias: 'main',
      meta: {
        color: 'blue',
      },
      options: {
        eMailAddress: 'main@example.com',
        inbox: {
          type: 'imap',
          host: 'imap.example.com',
          port: 993,
          tls: true,
          auth: {
            type: 'basic',
            username: 'imap-user',
            password: 'secret-imap-password',
          },
        },
        outbox: {
          type: 'smtp',
          host: 'smtp.example.com',
          port: 587,
          tls: true,
          auth: {
            type: 'basic',
            username: 'smtp-user',
            password: 'secret-smtp-password',
          },
        },
      },
    } as any;

    const dto = AccountDto.FromDbo(account);

    expect(dto.options.eMailAddress).toBe('main@example.com');
    expect(dto.options.inbox.auth).toBeUndefined();
    expect(dto.options.outbox.auth).toBeUndefined();
  });

  it('maps email list entries without content', () => {
    const email = {
      id: 'email-1',
      accountId: 'account-1',
      senderEmailAddressId: 'sender-1',
      replyEmailAddressId: 'reply-1',
      subject: 'Hello',
      htmlContent: '<p>Hello</p>',
      textContent: 'Hello',
      creationTime: '2026-01-01T00:00:00.000Z',
      readTime: null,
      sendTime: null,
      deletionTime: null,
    } as any;

    const dto = EmailListDto.FromDbo(email);

    expect(dto.id).toBe('email-1');
    expect((dto as any).content).toBeUndefined();
  });

  it('maps email single entries with content', () => {
    const email = {
      id: 'email-1',
      accountId: 'account-1',
      senderEmailAddressId: 'sender-1',
      replyEmailAddressId: 'reply-1',
      subject: 'Hello',
      htmlContent: '<p>Hello</p>',
      textContent: 'Hello',
      creationTime: '2026-01-01T00:00:00.000Z',
      readTime: null,
      sendTime: null,
      deletionTime: null,
    } as any;

    const dto = EmailSingleDto.FromDbo(email);

    expect(dto.content.html).toBe('<p>Hello</p>');
    expect(dto.content.text).toBe('Hello');
  });
});

