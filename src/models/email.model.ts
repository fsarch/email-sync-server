import { ApiProperty } from "@nestjs/swagger";
import { Optional } from "@nestjs/common";

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
