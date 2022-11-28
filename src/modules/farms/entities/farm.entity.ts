import { User } from "modules/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Farm {
  @PrimaryGeneratedColumn("uuid")
  public readonly id: string;

  @Column()
  public name: string;

  @Column()
  public address: string;

  @ManyToOne(() => User)
  public owner: User;

  @Column()
  public coordinates: string;

  @Column({ type: "decimal"})
  public size: number;

  @Column({ type: "decimal"})
  public yield: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
