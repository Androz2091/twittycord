import { Request, Response, NextFunction } from "express"
import User from "../../../database/models/user"
import logger from "../../../utils/logger"
import config from "../../../config"

const NAMESPACE = 'Api Controller';

export default {
    getAllUsers: (req: Request, res: Response, next: NextFunction) => {
        const key = req.query.key;
        if (key !== config.api.key) return res.status(401).send('Unauthorized');
        User.find()
            .exec()
            .then(users => {
                return res.json({ users, count: users.length });
            }).catch(err => {
                res.sendStatus(401);
                logger.error(NAMESPACE, err.message, err);
            });
    },
    getUser: (req: Request, res: Response, next: NextFunction) => {
        const key = req.query.key;
        if (key !== config.api.key) return res.status(401).send('Unauthorized');

        let { discordId } = req.query;

        User.findOne({ userId: discordId })
            .exec()
            .then(user => {
                return res.json({ user, found: user ? 1 : 0 });
            }).catch(err => {
                res.sendStatus(401);
                logger.error(NAMESPACE, err.message, err);
            });
    },
}