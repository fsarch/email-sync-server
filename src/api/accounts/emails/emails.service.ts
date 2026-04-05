import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from '../../../database/entities/email.entity.js';
import { Repository } from 'typeorm';
import { EmailCreateDto } from '../../../models/email.model.js';
import * as crypto from 'node:crypto';
import { EmailReceiver } from '../../../database/entities/email-receiver.entity.js';
import { EmailAddressesService } from '../../email-addresses/email-addresses.service.js';
import { AccountOptionsDto } from '../../../models/account.model.js';
import { AccountsRepositoryService } from '../../../repositories/accounts-repository/accounts-repository.service.js';
import * as nodemailer from 'nodemailer';

export type EmailListOptions = {
  page: number;
  limit: number;
  search?: string;
  sort?: EmailSortOption;
};

export type EmailSortDirection = 'ASC' | 'DESC';
export type EmailSortField = 'subject' | 'creationTime' | 'sendTime';

export type EmailSortOption = {
  direction: EmailSortDirection;
  field: EmailSortField;
};

export type EmailListResult = {
  items: Array<Email>;
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email)
    private readonly emailRepository: Repository<Email>,
    @InjectRepository(EmailReceiver)
    private readonly emailReceiverRepository: Repository<EmailReceiver>,
    private readonly emailAddressService: EmailAddressesService,
    private readonly accountService: AccountsRepositoryService,
  ) {}

  public async List(
    accountId: string,
    options: EmailListOptions,
  ): Promise<EmailListResult> {
    const sortFieldMap: Record<EmailSortField, string> = {
      subject: 'email.subject',
      creationTime: 'email.creationTime',
      sendTime: 'email.sendTime',
    };

    const sortField = options.sort?.field ?? 'creationTime';
    const sortDirection = options.sort?.direction ?? 'DESC';

    const query = this.emailRepository
      .createQueryBuilder('email')
      .where('email.accountId = :accountId', {
        accountId,
      });

    if (options.search?.trim()) {
      query.andWhere(
        `(
          email.subject ILIKE :search
          OR email.textContent ILIKE :search
          OR email.htmlContent ILIKE :search
        )`,
        {
          search: `%${options.search.trim()}%`,
        },
      );
    }

    query.orderBy(sortFieldMap[sortField], sortDirection);

    if (sortField !== 'creationTime') {
      query.addOrderBy('email.creationTime', 'DESC');
    }

    query
      .addOrderBy('email.id', 'DESC')
      .skip((options.page - 1) * options.limit)
      .take(options.limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page: options.page,
      limit: options.limit,
    };
  }

  public async GetById(accountId: string, emailId: string): Promise<Email> {
    return this.emailRepository.findOne({
      where: {
        id: emailId,
        accountId,
      },
    });
  }

  public async Create(
    accountId: string,
    emailCreateDto: EmailCreateDto,
  ): Promise<Pick<Email, 'id'>> {
    const id = crypto.randomUUID();

    const account = await this.accountService.GetById(accountId);

    const senderEmail = await this.emailAddressService.GetOrCreate({
      name: account.name,
      email: (account.options as AccountOptionsDto).eMailAddress,
    });

    const replyToEmail = emailCreateDto.replyTo
      ? await this.emailAddressService.GetOrCreate({
          name: emailCreateDto.replyTo.name || emailCreateDto.replyTo.email,
          email: emailCreateDto.replyTo.email,
        })
      : senderEmail;

    const createdEmail = this.emailRepository.create({
      id,
      accountId,
      senderEmailAddressId: senderEmail.id,
      replyEmailAddressId: replyToEmail.id,
      htmlContent: emailCreateDto.content.html ?? null,
      textContent: emailCreateDto.content.text ?? null,
      isTextContentGenerated: false,
      subject: emailCreateDto.subject,
    });
    const savedEmail = await this.emailRepository.save(createdEmail);

    const receiverEmailsPromises = emailCreateDto.receivers.map(
      async (receiver) => {
        const emailAddress = await this.emailAddressService.GetOrCreate({
          name: receiver.name || receiver.email,
          email: receiver.email,
        });

        const createdReceiver = this.emailReceiverRepository.create({
          id: crypto.randomUUID(),
          emailId: savedEmail.id,
          emailAddressId: emailAddress.id,
        });

        return await this.emailReceiverRepository.save(createdReceiver);
      },
    );

    await Promise.all(receiverEmailsPromises);

    return {
      id: savedEmail.id,
    };
  }

  public async Send(emailId: string): Promise<void> {
    const email = await this.emailRepository.findOne({
      where: {
        id: emailId,
      },
    });

    const account = await this.accountService.GetById(email.accountId);

    const emailReceivers = await this.emailReceiverRepository.find({
      where: {
        emailId,
      },
    });

    const receiverEmailAddresses = await Promise.all(
      emailReceivers.map(async (receiver) => {
        return await this.emailAddressService.GetById(receiver.emailAddressId);
      }),
    );

    console.log(receiverEmailAddresses);

    const replyEmailAddress = await this.emailAddressService.GetById(
      email.replyEmailAddressId,
    );
    const senderEmailAddress = await this.emailAddressService.GetById(
      email.senderEmailAddressId,
    );

    const transporter = nodemailer.createTransport({
      host: (account.options as AccountOptionsDto).outbox.host,
      port: (account.options as AccountOptionsDto).outbox.port,
      secure: (account.options as AccountOptionsDto).outbox.tls,
      auth: {
        user: (account.options as AccountOptionsDto).outbox.auth.username,
        pass: (account.options as AccountOptionsDto).outbox.auth.password,
      },
    });

    await transporter.sendMail({
      from: {
        name: senderEmailAddress.name,
        address: senderEmailAddress.email,
      },
      replyTo: {
        name: replyEmailAddress.name,
        address: replyEmailAddress.email,
      },
      subject: email.subject,
      html: email.htmlContent,
      text: email.textContent,
      to: receiverEmailAddresses.map((e) => ({
        address: e.email,
        name: e.name,
      })),
    });

    transporter.close();
  }
}
