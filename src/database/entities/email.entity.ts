import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'email',
})
export class Email {
  @PrimaryColumn('string', { type: 'varchar', length: 128 })
  id: string;

  @Column({
    name: 'account_id',
    type: 'uuid',
    nullable: false,
  })
  accountId: string;

  @Column({
    name: 'sender_email_address_id',
    type: 'uuid',
    nullable: false,
  })
  senderEmailAddressId: string;

  @Column({
    name: 'reply_email_address_id',
    type: 'uuid',
    nullable: true,
  })
  replyEmailAddressId: string;

  @Column({
    name: 'subject',
    type: 'varchar',
    length: 2048,
    nullable: false,
  })
  subject: string;

  @Column({
    name: 'html_content',
    type: 'text',
    nullable: true,
  })
  htmlContent: string;

  @Column({
    name: 'text_content',
    type: 'text',
    nullable: true,
  })
  textContent: string;

  @Column({
    name: 'is_text_content_generated',
    type: 'boolean',
    nullable: false,
  })
  isTextContentGenerated: boolean;

  @Column({
    name: 'creation_time',
    type: 'timestamp',
    nullable: false,
  })
  creationTime: string;

  @Column({
    name: 'read_time',
    type: 'timestamp',
    nullable: false,
  })
  readTime: string;

  @Column({
    name: 'send_time',
    type: 'timestamp',
    nullable: true,
  })
  sendTime: string;

  @Column({
    name: 'deletion_time',
    type: 'timestamp',
    nullable: false,
  })
  deletionTime: string;
}
