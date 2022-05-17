import { Request, Response, NextFunction } from 'express';
import { Profile } from 'passport';
import User from '../../database/models/user';

export default {
    discordAuth: (req: Request, res: Response, next: NextFunction) => {
        if (!req.isAuthenticated()) return res.redirect('/auth/discord');
        else return next();
    },
    discordGuest: (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) return res.redirect('/user/dashboard');
        else return next();
    },
    twitterGuest: async (req: Request, res: Response, next: NextFunction) => {
        User.findOne({ userId: (req.user as Profile).id })
        .exec()
        .then(result => {
            if (result?.connections?.filter(c => c.name == 'twitter')[0] ?? false) return res.redirect('/user/dashboard');
            else return next();
        });
    },
    instagramGuest: async (req: Request, res: Response, next: NextFunction) => {
        User.findOne({ userId: (req.user as Profile).id })
        .exec()
        .then(result => {
            if (result?.connections?.filter(c => c.name == 'instagram')[0] ?? false) return res.redirect('/user/dashboard');
            else return next();
        });
    },
    metamaskGuest: async (req: Request, res: Response, next: NextFunction) => {
        User.findOne({ userId: (req.user as Profile).id })
        .exec()
        .then(result => {
            if (result?.connections?.filter(c => c.name == 'metamask')[0] ?? false) return res.redirect('/user/dashboard');
            else return next();
        });
    }
}