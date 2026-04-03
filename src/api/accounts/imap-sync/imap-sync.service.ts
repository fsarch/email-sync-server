import { Injectable } from '@nestjs/common';
import { ImapFlow } from 'imapflow';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from '../../../database/entities/email.entity.js';
import { Repository } from 'typeorm';
import { AccountsRepositoryService } from '../../../repositories/accounts-repository/accounts-repository.service.js';
import { AccountOptionsDto } from '../../../models/account.model.js';
import { EmailAddressesService } from '../../email-addresses/email-addresses.service.js';
import * as crypto from 'node:crypto';
import { simpleParser } from 'mailparser';

@Injectable()
export class ImapSyncService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    private readonly accountService: AccountsRepositoryService,
    private readonly emailAddressService: EmailAddressesService,
  ) {}

  public async SyncEmails(accountId: string): Promise<void> {
    const account = await this.accountService.GetById(accountId);

    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }

    const options = account.options as AccountOptionsDto;

    const client = new ImapFlow({
      host: options.inbox.host,
      port: options.inbox.port,
      secure: options.inbox.tls,
      auth: {
        user: options.inbox.auth.username,
        pass: options.inbox.auth.password,
      },
    });

    try {
      await client.connect();

      // Select the INBOX mailbox
      const mailbox = await client.mailboxOpen('INBOX');

      // Get all message UIDs in the mailbox
      for await (const message of client.fetch('1:*', { envelope: true, source: true })) {
        try {
          // Parse the email
          const parsed = await simpleParser(message.source);

          // Generate unique message ID (preferring the email's Message-ID header)
          const messageId = parsed.messageId || `${message.uid}@${options.inbox.host}`;

          // Check if email already exists (by IMAP message ID)
          const existingEmail = await this.emailRepository.findOne({
            where: {
              imapMessageId: messageId,
              accountId,
            },
          });

          // Only sync if it doesn't exist
          if (!existingEmail) {
            const fromAddress = parsed.from?.value?.[0];
            const senderEmail = await this.emailAddressService.GetOrCreate({
              name: fromAddress?.name || 'Unknown',
              email: fromAddress?.address || 'unknown@unknown.com',
            });

            const emailRecord = this.emailRepository.create({
              id: crypto.randomUUID(),
              accountId,
              imapMessageId: messageId,
              senderEmailAddressId: senderEmail.id,
              replyEmailAddressId: senderEmail.id,
              subject: parsed.subject || '(No Subject)',
              htmlContent: parsed.html || null,
              textContent: parsed.text || null,
              isTextContentGenerated: !parsed.html && !!parsed.text,
              creationTime: new Date(parsed.date || new Date()).toISOString(),
              readTime: new Date().toISOString(),
              sendTime: null,
              deletionTime: null,
            });

            await this.emailRepository.save(emailRecord);
          }
        } catch (error) {
          console.error(`Error processing email UID ${message.uid}:`, error);
          // Continue with next email
        }
      }

      await client.logout();
    } catch (error) {
      console.error(`Error syncing emails for account ${accountId}:`, error);
      throw error;
    } finally {
      client.close();
    }
  }
}

