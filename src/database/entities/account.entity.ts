import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: 'account',
})
export class Account {
  @PrimaryColumn('string', { type: 'varchar', length: 128 })
  id: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  alias: string;

  @Column({ type: 'json' })
  meta?: {
    color?: string;
  };

  @Column({ type: 'json' })
  options?: Record<string, any>;
}
