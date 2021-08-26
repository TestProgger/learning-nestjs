import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name  :  "tags" })
export class TagEntity{

    @PrimaryGeneratedColumn()
    id : number

    @Column({ length :  256 , nullable : false , unique :  true })
    name :  string

}