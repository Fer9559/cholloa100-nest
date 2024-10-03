import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";



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

    @Column('text', ({
        nullable: false
    }))
    descripcion: string;
    
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

    //
    //imagenes:



}
