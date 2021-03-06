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
        let instagramConnection = user?.connections?.filter(c => c.name == 'instagram')[0]?.accountDisplayName ?? ''
        let metamaskConnection = user?.connections?.filter(c => c.name == 'metamask')[0]?.accountDisplayName ?? ''

        res.render('dashboard', { metamaskConnection, instagramConnection, twitterConnection, userFromDB: user });
    },
    delete: (req: Request, res: Response, next: NextFunction) => {
        User.deleteOne({ userId: (req.user as Profile).id })
            .exec()
            .then(result => {
                req.session.destroy(() => {
                    res.redirect('/user/dashboard');
                });
            }).catch(err => {
                res.sendStatus(401);
                logger.error(NAMESPACE, err.message, err);
            });
    }
}