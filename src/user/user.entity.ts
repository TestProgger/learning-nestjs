import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity("users")
export class UserEntity{

    @PrimaryGeneratedColumn()
    id : number

    @Column({unique :  true })
    username  : string

    @Column({ unique :  true })
    email : string

    @Column({select : false})
    password :  string

    @Column({ default : '' })
    bio : string

    @Column({ default :  '' })
    image  : string


    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password , 10);
    }

}