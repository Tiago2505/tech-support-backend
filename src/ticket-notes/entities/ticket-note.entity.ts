import { Ticket } from 'src/tickets/entities';
import { User } from 'src/users/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TicketNote {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @ManyToOne(() => Ticket)
  @JoinTable({ name: 'ticketId' })
  ticket!: Ticket;

  @Column()
  ticketId!: number;

  @ManyToOne(()=>User)
  @JoinTable({name: 'createdBy'})
  user!: User;

  @Column()
  createdBy!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

}
