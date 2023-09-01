import { Request, Response, NextFunction } from "express";
import { logger } from "../route/logger";
import { Users } from "../modules/user-entity";



export function checkIfAdmin( 
request: Request, response: Response, next: NextFunction
){

    const user = request["user"] as Users || { isAdmin: false };

    if (!user.id === undefined || !user.isAdmin) {
        logger.error(`The is not an admin, access denied`);
        response.sendStatus(403);
        return;
    }

    logger.debug(`The user is valid admin, granting access.`);

    next();

}