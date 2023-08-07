import {Response, Request} from "express";

export const root = (request: Request, response: Response ) => {
    response.status(200).send('The backend project v4 is live and running');
    console.log('Typescript');
}