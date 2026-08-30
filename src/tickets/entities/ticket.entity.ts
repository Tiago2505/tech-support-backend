import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  CategoryTicket,
  DeviceType,
  OperatingSystem,
  PriorityTicket,
  StatusTicket,
} from '../enums';
import { User } from 'src/users/entities';
import { ImageDto } from '../dto';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  title!: string;

  @Column('text')
  description!: string;

  @Column('jsonb', { nullable: true })
  evidence?: ImageDto[];

  @Column('enum', {
    enum: StatusTicket,
    default: StatusTicket.OPEN,
  })
  status!: StatusTicket;

  @Column('enum', {
    enum: PriorityTicket,
    default: PriorityTicket.MEDIUM,
  })
  priority!: PriorityTicket;

  @Column('enum', {
    enum: CategoryTicket,
    default: CategoryTicket.HARDWARE,
  })
  categoryTicket!: CategoryTicket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  userId!: number;

  @Column()
  createdBy!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'technicianId' })
  technician!: User;

  @Column({
    nullable: true,
  })
  technicianId!: number;

  @Column('enum', {
    enum: DeviceType,
    default: DeviceType.DESKTOP,
  })
  deviceType!: DeviceType;

  @Column('text', { nullable: true })
  deviceBrand!: string;

  @Column('text', { nullable: true })
  deviceModel!: string;

  @Column('enum', {
    enum: OperatingSystem,
    default: OperatingSystem.WINDOWS,
  })
  operatingSystem!: OperatingSystem;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @Column('timestamp', { nullable: true })
  resolvedAt!: Date;

  @Column('timestamp', { nullable: true })
  closedAt!: Date;
}
