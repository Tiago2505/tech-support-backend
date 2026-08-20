import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CategoryTicket, DeviceType, OperatingSystem, PriorityTicket, StatusTicket } from "../enums";
import { User } from "src/users/entities";

@Entity()
export class Ticket {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    title!: string;

    @Column('text')
    description!: string;

    @Column('enum',{
        enum: [StatusTicket]
    })
    status!: StatusTicket;

    @Column('enum',{
        enum: [PriorityTicket]
    })
    priority!: PriorityTicket;

    @Column('enum', {
        enum: [CategoryTicket]
    })
    categoryTicket!: CategoryTicket;

    @ManyToOne(()=>User)
    @JoinColumn({name: 'createdBy'})
    userId!: number;

    @Column()
    createdBy!: number;

    @ManyToOne(()=>User)
    @JoinColumn({name: 'technicianId'})
    technician!: User;

    @Column()
    technicianId!: number;

    @Column('enum',{
        enum: [DeviceType]
    })
    deviceType!: DeviceType;

    @Column('text')
    deviceBrand!: string;

    @Column('text')
    deviceModel!: string;

    @Column('enum',{
        enum: [OperatingSystem]
    })
    operatingSystem!: OperatingSystem;

    @CreateDateColumn()
    createdAt!: Date;

    @Column('date')
    resolvedAt!: Date;

    @Column('date')
    closedAt!: Date;
}
