import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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
        nullable: false
    })
    enlace: string;

    @Column('text')
    descripcion: string;

    // @CreateDateColumn({
    //     type: 'timestamp',
    //     default: () => 'now()',
    //   })
    //   createdAt: Date;
    
    // @UpdateDateColumn({
    //     type: 'timestamp',
    //     default: () => 'now()',
    //   })
    //   updatedAt: Date;

    //
    //imagenes:



}
