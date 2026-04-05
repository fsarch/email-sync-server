import {
  Body,
  Controller,
  DefaultValuePipe,
  BadRequestException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EmailsService } from './emails.service.js';
import { Roles } from '../../../fsarch/uac/decorators/roles.decorator.js';
import { Role } from '../../../fsarch/auth/role.enum.js';
import {
  EmailSortOption,
  EmailSortDirection,
  EmailSortField,
} from './emails.service.js';
import {
  EmailCreateDto,
  EmailListResponseDto,
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
    type: EmailListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 25,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'invoice',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    example: 'desc:creationTime',
    description: 'Format: asc:subject, desc:creationTime oder asc:sendTime',
  })
  public async List(
    @Param('accountId') accountId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    if (page < 1) {
      throw new BadRequestException('page must be >= 1');
    }

    if (limit < 1 || limit > 100) {
      throw new BadRequestException('limit must be between 1 and 100');
    }

    const result = await this.emailsService.List(accountId, {
      page,
      limit,
      search,
      sort: this.ParseSort(sort),
    });

    return EmailListResponseDto.FromDbo(
      result.items,
      result.total,
      result.page,
      result.limit,
    );
  }

  private ParseSort(sort?: string): EmailSortOption | undefined {
    if (!sort?.trim()) {
      return undefined;
    }

    const match = /^(asc|desc):(subject|creationTime|sendTime)$/i.exec(sort.trim());

    if (!match) {
      throw new BadRequestException(
        'sort must match "asc:subject", "desc:creationTime" or "asc:sendTime"',
      );
    }

    const direction = match[1].toUpperCase() as EmailSortDirection;
    const fieldStr = match[2].toLowerCase();
    let field: EmailSortField = 'creationTime';

    if (fieldStr === 'subject') {
      field = 'subject';
    } else if (fieldStr === 'sendtime') {
      field = 'sendTime';
    }

    return {
      direction,
      field,
    };
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
