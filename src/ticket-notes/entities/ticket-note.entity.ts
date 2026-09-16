import { Ticket } from 'src/tickets/entities';
import { User } from 'src/users/entities';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
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
  @JoinColumn({ name: 'ticketId' })
  ticket!: Ticket;

  @Column()
  ticketId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  user!: User;

  @Column()
  createdBy!: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt!: Date;
}
