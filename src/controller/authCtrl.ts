import { Request, Response } from "express";
import { AppDataSource } from "../route/data-source";
import { logger } from "../route/logger";

export  const loginRender = (request: Request, response: Response) => {
    try {
        response.render("login");
    } catch (error) {
        logger.error('Error rendering login view:', error);
        response.status(500).send('Internal Server Error');
    }
};

// export class Control {
//     static login(req: Request, res: Response): void {
//         res.render('login'); // This will render the index.ejs view
//     }
// }