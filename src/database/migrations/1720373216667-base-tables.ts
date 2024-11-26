import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
  TableUnique,
} from 'typeorm';
import { getDataType } from './utils/data-type.mapper.js';

export class BaseTables1720373216667 implements MigrationInterface {
  name = 'BaseTables1720373216667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const databaseType = queryRunner.connection.driver.options.type;

    // region content_type
    await queryRunner.createTable(
      new Table({
        name: 'content_type',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__content_type',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '256',
            isNullable: false,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '256',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.manager.insert('content_type', [
      {
        id: 1,
        name: 'Plain',
        mime_type: 'text/plain',
      },
      {
        id: 2,
        name: 'HTML',
        mime_type: 'text/html',
      },
      {
        id: 3,
        name: 'Markdown',
        mime_type: 'text/markdown',
      },
      {
        id: 4,
        name: 'PDF',
        mime_type: 'application/pdf',
      },
      {
        id: 5,
        name: 'JPG',
        mime_type: 'image/jpeg',
      },
      {
        id: 6,
        name: 'PNG',
        mime_type: 'image/png',
      },
      {
        id: 7,
        name: 'MP4',
        mime_type: 'video/mp4',
      },
      {
        id: 8,
        name: 'GIF',
        mime_type: 'image/gif',
      },
      {
        id: 9,
        name: 'WEBM Video',
        mime_type: 'video/webm',
      },
      {
        id: 10,
        name: 'WEBM Audio',
        mime_type: 'audio/webm',
      },
      {
        id: 11,
        name: 'WEBP',
        mime_type: 'image/webp',
      },
      {
        id: 12,
        name: 'Avif',
        mime_type: 'image/avif',
      },
      {
        id: 13,
        name: 'Unknown Binary Data',
        mime_type: 'application/octet-stream',
      },
    ]);
    // endregion

    // region account
    await queryRunner.createTable(
      new Table({
        name: 'account',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__account',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '256',
            isNullable: false,
          },
          {
            name: 'alias',
            type: 'varchar',
            length: '256',
            isNullable: false,
          },
          {
            name: 'meta',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'options',
            type: 'jsonb',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'account',
      new TableUnique({
        name: 'uk__account__alias',
        columnNames: ['alias'],
      }),
    );
    // endregion

    // region email_address
    await queryRunner.createTable(
      new Table({
        name: 'email_address',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__email_address',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'external_id',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'email_address',
      new TableIndex({
        isUnique: true,
        name: 'UQ__email_address__name__email',
        columnNames: ['name', 'email'],
        where: 'deletion_time IS NULL',
      }),
    );

    await queryRunner.createIndex(
      'email_address',
      new TableIndex({
        isUnique: true,
        name: 'UQ__email_address__external_id',
        columnNames: ['external_id'],
        where: 'deletion_time IS NULL',
      }),
    );
    // endregion

    // region email
    await queryRunner.createTable(
      new Table({
        name: 'email',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__thread',
          },
          {
            name: 'account_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'sender_email_address_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'reply_email_address_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'subject',
            type: 'varchar',
            length: '2048',
            isNullable: true,
          },
          {
            name: 'html_content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'text_content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'is_text_content_generated',
            type: getDataType(databaseType, 'boolean'),
            isNullable: false,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'read_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
          {
            name: 'send_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'email',
      new TableForeignKey({
        name: 'fk__email__account_id',
        columnNames: ['account_id'],
        referencedTableName: 'account',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'email',
      new TableForeignKey({
        name: 'fk__sender_email_address_id',
        columnNames: ['sender_email_address_id'],
        referencedTableName: 'email_address',
        referencedColumnNames: ['id'],
      }),
    );
    // endregion

    // region email-receiver
    await queryRunner.createTable(
      new Table({
        name: 'email_receiver',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__thread',
          },
          {
            name: 'email_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'email_address_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'email_receiver',
      new TableForeignKey({
        name: 'fk__email_receiver__email_id',
        columnNames: ['email_id'],
        referencedTableName: 'email',
        referencedColumnNames: ['id'],
      }),
    );

    await queryRunner.createForeignKey(
      'email_receiver',
      new TableForeignKey({
        name: 'fk__email_receiver__email_address_id',
        columnNames: ['email_address_id'],
        referencedTableName: 'email_address',
        referencedColumnNames: ['id'],
      }),
    );
    // endregion

    // region tag
    await queryRunner.createTable(
      new Table({
        name: 'tag',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__tag',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'tag',
      new TableIndex({
        isUnique: true,
        name: 'UQ__tag__name',
        columnNames: ['name'],
        where: 'deletion_time IS NULL',
      }),
    );
    // endregion

    // region email_tag
    await queryRunner.createTable(
      new Table({
        name: 'email_tag',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            primaryKeyConstraintName: 'pk__email_tag',
          },
          {
            name: 'email_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'tag_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'varchar',
            length: '2048',
            isNullable: false,
            default: "''",
          },
          {
            name: 'creation_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deletion_time',
            type: getDataType(databaseType, 'timestamp'),
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'email_tag',
      new TableIndex({
        isUnique: true,
        name: 'UQ__email_tag__email_id__tag_id__value',
        columnNames: ['email_id', 'tag_id', 'value'],
        where: 'deletion_time IS NULL',
      }),
    );
    // endregion
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('email_tag');
    await queryRunner.dropTable('email');
    await queryRunner.dropTable('email_address');
    await queryRunner.dropTable('account');
    await queryRunner.dropTable('content_type');
    await queryRunner.dropTable('tag');
  }
}
