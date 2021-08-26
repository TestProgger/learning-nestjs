import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./user.entity";
import { sign  } from 'jsonwebtoken';
import { JWT_SECRET } from "src/config";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/loginUser.dto";
import * as bcrypt from 'bcrypt'


@Injectable()
export class UserService{

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository : Repository<UserEntity>
    ){}

    async createUser(createUserDto : CreateUserDto):Promise<UserEntity>{
        const newUser = new UserEntity();
        Object.assign(newUser , createUserDto);
        return await this.userRepository.save(newUser);
    }

    async login( loginUserDto : LoginUserDto ):Promise<UserEntity>{
        const user = await this.userRepository.findOne({ email : loginUserDto.email } , { select : ["id" , "username" , "image" , "bio" , "email", "password" ] })
        if( !user ){
            throw new HttpException("Credentials are not valid" , HttpStatus.UNPROCESSABLE_ENTITY)
        }

        const isPasswordCorrect  = await bcrypt.compare(loginUserDto.password , user.password);

        if( !isPasswordCorrect ){
            throw new HttpException("Credentials are not valid" , HttpStatus.UNPROCESSABLE_ENTITY)
        }

        delete user.password

        return user
    }

    async findById( id : number ) : Promise<UserEntity>{
        return this.userRepository.findOne(id);
    }
    buildUserResponse(user : UserEntity):UserResponseInterface{
        if( user ){
            return {
                user : {
                    ...user,
                    token : this.generateJWT(user)
                }
            }
        }

        return { user : null }
        
    }

    generateJWT(user : UserEntity):string{
        return sign( {
            id : user.id,
            username :  user.username,
            email :  user.email
        } , JWT_SECRET )
    }

}