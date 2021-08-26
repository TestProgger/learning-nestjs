import { Body, Controller, Post , Get, UsePipes, ValidationPipe, Req, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { UserService } from "./user.service";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./user.entity";
import { AuthGuard } from "./guards/auth.guard";

@Controller()
export class UserController{

    constructor(
        private readonly userService: UserService
    ){}

    @Post('users')
    @UsePipes( new ValidationPipe() )
    async createUser(@Body('user') createUserDto : CreateUserDto):Promise<UserResponseInterface>{
        const user = await this.userService.createUser(createUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Post("users/login")
    @UsePipes( new ValidationPipe())
    async login(@Body('user') loginUserDto : LoginUserDto) : Promise<UserResponseInterface>{
        const user = await this.userService.login(loginUserDto);
        return this.userService.buildUserResponse(user);
    }

    @Get("user")
    @UseGuards(AuthGuard)    
    async currentUser(
        @User() user : UserEntity,
        @User('id') id : number
        ): Promise<UserResponseInterface>{ 
        return this.userService.buildUserResponse(user);
    }

}