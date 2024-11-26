import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../fsarch/uac/decorators/roles.decorator';
import { Role } from '../../fsarch/auth/role.enum';
import { EmailAddressesService } from './email-addresses.service';
import { EmailAddressDto } from '../../models/email-address.model';

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
