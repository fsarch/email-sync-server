import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Email } from '../database/entities/email.entity.js';

export class EmailCreateContentDto {
  @Optional()
  @ApiProperty()
  html?: string;

  @Optional()
  @ApiProperty()
  text?: string;
}

export class EmailCreateEmailDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  @Optional()
  name?: string;
}

export class EmailCreateDto {
  @ApiProperty()
  @Optional()
  replyTo?: EmailCreateEmailDto;

  @ApiProperty({
    isArray: true,
    type: EmailCreateEmailDto,
  })
  receivers: Array<EmailCreateEmailDto>;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  content: EmailCreateContentDto;
}

export class EmailContentDto {
  @ApiProperty()
  html?: string;

  @ApiProperty()
  text?: string;
}

export class EmailListDto {
  public static FromDbo(email: Email) {
    const dto = new EmailListDto();

    dto.id = email.id;
    dto.accountId = email.accountId;
    dto.senderEmailAddressId = email.senderEmailAddressId;
    dto.replyEmailAddressId = email.replyEmailAddressId;
    dto.subject = email.subject;
    dto.creationTime = email.creationTime;
    dto.readTime = email.readTime;
    dto.sendTime = email.sendTime;
    dto.deletionTime = email.deletionTime;

    return dto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  senderEmailAddressId: string;

  @ApiProperty()
  replyEmailAddressId: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  creationTime: string;

  @ApiProperty()
  readTime: string;

  @ApiProperty()
  sendTime: string;

  @ApiProperty()
  deletionTime: string;
}

export class EmailListMetaDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class EmailListResponseDto {
  public static FromDbo(
    emails: Array<Email>,
    total: number,
    page: number,
    limit: number,
  ) {
    const dto = new EmailListResponseDto();

    dto.items = emails.map(EmailListDto.FromDbo);
    dto.meta = {
      total,
      page,
      limit,
    };

    return dto;
  }

  @ApiProperty({
    type: EmailListDto,
    isArray: true,
  })
  items: Array<EmailListDto>;

  @ApiProperty({
    type: EmailListMetaDto,
  })
  meta: EmailListMetaDto;
}

export class EmailSingleDto extends EmailListDto {
  public static FromDbo(email: Email) {
    const dto = new EmailSingleDto();
    const baseDto = EmailListDto.FromDbo(email);

    Object.assign(dto, baseDto);
    dto.content = {
      html: email.htmlContent,
      text: email.textContent,
    };

    return dto;
  }

  @ApiProperty()
  content: EmailContentDto;
}

