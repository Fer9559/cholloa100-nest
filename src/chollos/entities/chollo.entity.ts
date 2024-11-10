import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CholloImage } from "./chollo-image.entity";
import { User } from "src/auth/entities/user.entity";



@Entity()
export class Chollos {

    @PrimaryGeneratedColumn('uuid')
    id_chollo: string;

    @Column({
        nullable: false
    })
    titulo: string;

    @Column('numeric', {
        nullable: false
    })
    precio: number;

    @Column({
        nullable: false,
        unique: true
    })
    enlace: string;

    @Column('text', ({
        nullable: false
    }))
    descripcion: string;

    @OneToMany(
        () => CholloImage,
        (cholloImage) => cholloImage.chollo,
        {cascade: true, eager: true}
    )
    images?: CholloImage[];

    @ManyToOne(
        () => User,
        (user) => user.chollos,
        { eager: true}
    )
    user: User;
    
    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'now()',
      })
      createdAt: Date;
    
    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'now()',
      })
      updatedAt: Date;

}
