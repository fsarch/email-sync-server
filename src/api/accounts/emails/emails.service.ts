import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from '../../../database/entities/email.entity';
import { Repository } from 'typeorm';
import { EmailCreateDto } from '../../../models/email.model';
import * as crypto from 'node:crypto';
import { EmailReceiver } from '../../../database/entities/email-receiver.entity';
import { EmailAddressesService } from '../../email-addresses/email-addresses.service';
import { AccountOptionsDto } from '../../../models/account.model';
import { AccountsRepositoryService } from '../../../repositories/accounts-repository/accounts-repository.service';
import * as nodemailer from 'nodemailer';

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

        const savedReceiver = await this.emailReceiverRepository.save(createdReceiver);

        return savedReceiver;
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
