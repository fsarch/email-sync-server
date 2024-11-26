import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'email_receiver',
})
export class EmailReceiver {
  @PrimaryColumn('string', { type: 'varchar', length: 128 })
  id: string;

  @Column({
    name: 'email_id',
    type: 'uuid',
    nullable: false,
  })
  emailId: string;

  @Column({
    name: 'email_address_id',
    type: 'uuid',
    nullable: false,
  })
  emailAddressId: string;

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
