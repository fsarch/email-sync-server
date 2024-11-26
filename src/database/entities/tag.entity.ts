import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: 'tag',
})
export class Tag {
  @PrimaryColumn('string', { type: 'varchar', length: 128 })
  id: string;

  @Column({
    name: 'email_id',
    type: 'uuid',
    nullable: false,
  })
  emailId: string;

  @Column({
    name: 'tag_id',
    type: 'uuid',
    nullable: false,
  })
  tagId: string;

  @Column({
    name: 'value',
    type: 'varchar',
    length: 2048,
    nullable: false,
  })
  value: string;

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
