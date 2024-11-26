import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailAddress } from '../../database/entities/email-address.entity';
import { Repository } from 'typeorm';
import { EmailAddressCreateDto } from '../../models/email-address.model';

@Injectable()
export class EmailAddressesService {
  constructor(
    @InjectRepository(EmailAddress)
    private readonly emailAddressRepository: Repository<EmailAddress>,
  ) {}

  public async List(): Promise<Array<EmailAddress>> {
    return await this.emailAddressRepository.find();
  }

  public async GetById(id: string): Promise<EmailAddress> {
    return this.emailAddressRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async GetOrCreate(
    emailAddressCreateDto: EmailAddressCreateDto,
  ): Promise<EmailAddress> {
    const existingEmail = await this.emailAddressRepository.findOneBy({
      email: emailAddressCreateDto.email,
    });

    if (existingEmail) {
      return existingEmail;
    }

    const id = crypto.randomUUID();

    const createdEmail = this.emailAddressRepository.create({
      id,
      ...emailAddressCreateDto,
    });
    const savedEmail = await this.emailAddressRepository.save(createdEmail);

    return savedEmail;
  }
}
