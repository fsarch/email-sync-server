import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EmailsService } from './emails.service';
import { Roles } from '../../../fsarch/uac/decorators/roles.decorator';
import { Role } from '../../../fsarch/auth/role.enum';
import { EmailCreateDto } from '../../../models/email.model';

@ApiTags('emails')
@Controller({
  path: 'accounts/:accountId/emails',
  version: '1',
})
@ApiBearerAuth()
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

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
