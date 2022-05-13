import { Request, Response, NextFunction } from "express"
import UserInterface from "../../../interfaces/UserInterface";
import User from "../../../database/models/user";
import { Profile } from "passport";
import logger from "../../../utils/logger";

const NAMESPACE = 'Dashboard Controller';

export default {
    index: (req: Request, res: Response, next: NextFunction) => {
        let user = req.session.user;
        
        if (!user) {
            User.findOne({ userId: (req.user as Profile).id })
                .exec()
                .then(resultUser => {
                    req.session.user = resultUser;
                    req.session.save();
                    user = resultUser;
                }).catch(err => logger.error(NAMESPACE, err.message));
        }
            
        let twitterConnection = user?.connections?.filter(c => c.name == 'twitter')[0]?.accountDisplayName ?? ''

        res.render('dashboard', { twitterConnection, userFromDB: user });
    }
}