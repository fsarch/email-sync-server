import { ApiProperty } from '@nestjs/swagger';
import { EmailAddress } from '../database/entities/email-address.entity';

export class EmailAddressDto {
  public static FromDbo(emailAddress: EmailAddress): EmailAddressDto {
    const emailAddressDto = new EmailAddressDto();

    emailAddressDto.id = emailAddress.id;
    emailAddressDto.name = emailAddress.name;
    emailAddressDto.email = emailAddress.email;

    return emailAddressDto;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}

export class EmailAddressCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
