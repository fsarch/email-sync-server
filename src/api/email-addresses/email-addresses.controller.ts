import { Roles } from '@fsarch/server/uac';
import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../../constants/role.enum.js';
import { EmailAddressDto } from '../../models/email-address.model.js';
import { EmailAddressesService } from './email-addresses.service.js';

@ApiTags('email-addresses')
@Controller({
  path: 'email-addresses',
  version: '1',
})
@ApiBearerAuth()
export class EmailAddressesController {
  constructor(private readonly emailAddressesService: EmailAddressesService) {}

  @Post()
  @Roles(Role.manage)
  public async List() {
    const emailAddresses = await this.emailAddressesService.List();
    return emailAddresses.map(EmailAddressDto.FromDbo);
  }
}
