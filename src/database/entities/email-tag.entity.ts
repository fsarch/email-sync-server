import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: 'email_tag',
})
export class EmailTag {
  @PrimaryColumn('string', { type: 'varchar', length: 128 })
  id: string;

  @Column({
    name: 'external_id',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  externalId: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'customer_id',
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  customerId: string;

  @Column({
    name: 'communication_provider_id',
    type: 'varchar',
    length: 128,
    nullable: true,
  })
  communicationProviderId: string;

  @Column({
    name: 'communication_provider_meta',
    type: 'json',
    nullable: true,
  })
  communicationProviderMeta: Record<string, any>;

  @Column({
    name: 'last_message_read_time',
    type: 'timestamp',
    nullable: true,
  })
  lastMessageReadTime: string;
}
