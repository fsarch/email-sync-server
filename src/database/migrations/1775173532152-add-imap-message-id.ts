import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm";

export class AddImapMessageIdToEmail1775173532152 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'email',
      new TableColumn({
        name: 'imap_message_id',
        type: 'varchar',
        length: '512',
        isNullable: true,
      }),
    );

    await queryRunner.createIndex(
      'email',
      new TableIndex({
        name: 'IDX_EMAIL_IMAP_MESSAGE_ID',
        columnNames: ['account_id', 'imap_message_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('email', 'IDX_EMAIL_IMAP_MESSAGE_ID');
    await queryRunner.dropColumn('email', 'imap_message_id');
  }
}

