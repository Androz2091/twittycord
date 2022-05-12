import { Request, Response, NextFunction } from "express"
import UserInterface from "../../../interfaces/UserInterface";
import User from "../../../database/models/user";
import { Profile } from "passport";
import logger from "../../../utils/logger";

const NAMESPACE = 'Dashboard Controller';

export default {
    index: (req: Request, res: Response, next: NextFunction) => {
        let twitterConnection = req.session.user?.connections?.filter(c => c.name == 'twitter')[0] ?? false

        if (!req.session.user) {
            User.findOne({ userId: (req.user as Profile).id })
                .exec()
                .then(resultUser => {
                    req.session.user = resultUser;
                    req.session.save();

                    twitterConnection = resultUser?.connections?.filter(c => c.name == 'twitter')[0] ?? false
                }).catch(err => logger.error(NAMESPACE, err.message));
        }
        
        res.render('dashboard', { twitterConnection });
    }
}