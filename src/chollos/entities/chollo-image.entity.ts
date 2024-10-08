import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chollos } from "./chollo.entity";


@Entity()
export class CholloImage{

  @PrimaryGeneratedColumn()
  id_imagen: number;

  @Column('text')
  url: string

  @ManyToOne(
    () => Chollos,
    (chollo) => chollo.images
  )
  chollo: Chollos
}