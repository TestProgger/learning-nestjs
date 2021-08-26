import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request , Response , NextFunction } from 'express';
import { ExpressRequestInterface } from "src/types/expressRequest.interface";
import * as jsonwebtoken from 'jsonwebtoken'
import { JWT_SECRET } from "src/config";
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware{

    constructor( private readonly userService : UserService){}

    async use( req :  ExpressRequestInterface , res : Response , next :  NextFunction )
    {
        if( !req.headers.authorization ){
            req.user = null
            next();
            return;
        }

        const token = req.headers.authorization.split(" ")[1];

        try {
            const decode = jsonwebtoken.verify( token , JWT_SECRET );
            req.user = await this.userService.findById((decode as jsonwebtoken.JwtPayload).id);
        } catch (error) {
            req.user = null
        }

        next();
    }
}