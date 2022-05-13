import { Request, Response, NextFunction } from "express"
import config from "../../../config";
import { TwitterApi } from "twitter-api-v2";
import User from "../../../database/models/user";
import UserInterface from "../../../interfaces/UserInterface";
import UserConnectionInterface from "../../../interfaces/UserConnectionInterface";
import logger from "../../../utils/logger";
import { Profile } from "passport";
import Strategy from "passport-discord";

const NAMESPACE = 'Auth Controller';

export default {
    discord: {
        authenticated: (req: Request, res: Response) => {
            let profile = req.user as Strategy.Profile;

            User.findOne({ userId: profile.id })
            .exec()
            .then(resultUser => {
                if (resultUser) {
                    req.session.user = resultUser;
                    req.session.save();

                    return res.redirect('/user/dashboard');
                } else User.create({ userId: profile.id, userEmail: profile?.email }).then(createdUser => {
                    req.session.user = createdUser;
                    req.session.save();
                    
                    return res.redirect('/user/dashboard');
                }).catch(err => logger.error(NAMESPACE, err.message));
            }).catch(err => logger.error(NAMESPACE, err.message));
        },
        logout: (req: Request, res: Response) => {
            req.logout()
            res.redirect('/');
        },
    },
    twitter: {
        authenticate: (req: Request, res: Response) => {
            let client = new TwitterApi({ clientId: config.twitter.clientId, clientSecret: config.twitter.clientSecret });

            let { url, codeVerifier, state } = client.generateOAuth2AuthLink(
                config.twitter.callbackURI,
                { scope: config.twitter.scopes }
            );

            req.session.codeVerifier = codeVerifier;
            req.session.state = state;

            res.redirect(url);
        },
        callback: (req: Request, res: Response) => {
            let { state, code } = req.query;
            let { codeVerifier, state: sessionState } = req.session;

            if (!codeVerifier || !state || !sessionState || !code) {
                return res.status(400).send('You denied the app or your session expired!');
            }

            if (state !== sessionState) {
                return res.status(400).send('Stored tokens didnt match!');
            }

            let client = new TwitterApi({ clientId: config.twitter.clientId, clientSecret: config.twitter.clientSecret });

            client.loginWithOAuth2({ code: (code as string), codeVerifier, redirectUri: config.twitter.callbackURI })
                .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn }) => {
                    const { data: userObject } = await loggedClient.v2.me();

                    let connection: UserConnectionInterface = { name: 'twitter', accountId: userObject.id, accountDisplayName: userObject.username }                    
                    
                    User.findOneAndUpdate(
                        { userId: (req.user as Profile).id },
                        { $push: { connections: connection } },
                        { returnDocument: 'after' }
                    )
                    .exec()
                    .then(result => {
                        req.session.user = result;
                        req.session.save();

                        res.redirect('/user/dashboard');
                    })
                    .catch(err => logger.error(NAMESPACE, err.message, err));
                });
        }
    }
}