import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'email_address',
})
export class EmailAddress {
  @PrimaryColumn('string', { type: 'varchar', length: 128 })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'external_id',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  externalId: string;

  @Column({
    name: 'creation_time',
    type: 'timestamp',
    nullable: false,
  })
  creationTime: string;

  @Column({
    name: 'deletion_time',
    type: 'timestamp',
    nullable: false,
  })
  deletionTime: string;
}
