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
import type { TicketDiagnosisResponse } from 'src/openai/dto';
import { ImageDto } from 'src/cloudinary/dtos';

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
  user!: User;

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

  @Column('jsonb', { nullable: true })
  aiDiagnosis!: TicketDiagnosisResponse | null;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt!: Date;

  @Column('timestamp', { nullable: true })
  closedAt!: Date | null;

  @Column('text', {
    nullable: true,
  })
  resolution!: string | null;
}
