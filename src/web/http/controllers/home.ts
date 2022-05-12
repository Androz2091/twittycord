import { Request, Response, NextFunction } from "express"

export default {
    index: (req: Request, res: Response, next: NextFunction) => {
        res.render('home');
    }
}