import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmailsService } from './emails.service.js';
import { Roles } from '../../../fsarch/uac/decorators/roles.decorator.js';
import { Role } from '../../../fsarch/auth/role.enum.js';
import {
  EmailCreateDto,
  EmailListDto,
  EmailSingleDto,
} from '../../../models/email.model.js';

@ApiTags('emails')
@Controller({
  path: 'accounts/:accountId/emails',
  version: '1',
})
@ApiBearerAuth()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get()
  @Roles(Role.manage)
  @ApiOkResponse({
    type: EmailListDto,
    isArray: true,
  })
  public async List(@Param('accountId') accountId: string) {
    const emails = await this.emailsService.List(accountId);

    return emails.map(EmailListDto.FromDbo);
  }

  @Get(':emailId')
  @Roles(Role.manage)
  @ApiOkResponse({
    type: EmailSingleDto,
  })
  @ApiNotFoundResponse({
    description: 'Email wurde nicht gefunden',
  })
  public async Get(
    @Param('accountId') accountId: string,
    @Param('emailId') emailId: string,
  ) {
    const email = await this.emailsService.GetById(accountId, emailId);

    if (!email) {
      throw new NotFoundException(`Email ${emailId} not found`);
    }

    return EmailSingleDto.FromDbo(email);
  }

  @Post()
  @Roles(Role.manage)
  public async Send(
    @Param('accountId') accountId: string,
    @Body() emailCreateDto: EmailCreateDto,
  ) {
    const createdEmail = await this.emailsService.Create(
      accountId,
      emailCreateDto,
    );

    await this.emailsService.Send(createdEmail.id);

    return {
      id: createdEmail.id,
    };
  }
}
