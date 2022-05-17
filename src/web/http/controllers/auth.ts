import { Request, Response, NextFunction } from "express"
import config from "../../../config";
import { TwitterApi } from "twitter-api-v2";
import User from "../../../database/models/user";
import UserConnectionInterface from "../../../interfaces/UserConnectionInterface";
import InstagramUserProfileInterface from "../../../interfaces/InstagramUserProfileInterface";
import logger from "../../../utils/logger";
import { Profile } from "passport";
import Strategy from "passport-discord";
import { fromRpcSig, hashPersonalMessage, ecrecover, pubToAddress, addHexPrefix } from 'ethereumjs-util';

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
                req.flash('error', 'You denied the app or your session expired!');
                return res.redirect('/user/dashboard');
            }

            if (state !== sessionState) {
                req.flash('error', 'Stored, tokens didn\'t match please try again');
                return res.redirect('/user/dashboard');
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

                        req.flash('success', 'Twitter connection successful!');
                        res.redirect('/user/dashboard');
                    })
                    .catch(err => logger.error(NAMESPACE, err.message, err));
                });
        }
    },
    instagram: {
        authenticated: (req: Request, res: Response) => {
            let profile = req.session.instagramUserProfile;

            if (!profile) {
                req.flash('error', 'Please try connecting again.');
                return res.redirect('/user/dashboard');
            }

            let connection: UserConnectionInterface = Object.assign({ name: 'instagram' }, profile);
            
            User.findOneAndUpdate(
                { userId: (req.user as Profile).id },
                { $push: { connections: connection } },
                { returnDocument: 'after' }
            )
            .exec()
            .then(result => {
                req.session.user = result;
                req.session.save();

                req.flash('success', 'Instagram connection successful!');
                res.redirect('/user/dashboard');
            })
            .catch(err => logger.error(NAMESPACE, err.message, err));
        }
    },
    metamask: {
        authenticate: (req: Request, res: Response, next: NextFunction) => {
            let { address, signature, message } = req.body;

            let sig = fromRpcSig(signature);
            let msg = hashPersonalMessage(Buffer.from(message));
            let publicKey = ecrecover(msg, sig.v, sig.r, sig.s);
            let pubAddress = pubToAddress(publicKey);
            let signedAddress = addHexPrefix(pubAddress.toString('hex'))
        
            address = address.toLocaleLowerCase()
            let shortname = address.substring(0, 5) + '...' + address.slice(-4);

            if (signedAddress.toLocaleLowerCase() === address) {
                let connection: UserConnectionInterface = { name: 'metamask', accountId: address, accountDisplayName: shortname };
                    
                User.findOneAndUpdate(
                    { userId: (req.user as Profile).id },
                    { $push: { connections: connection } },
                    { returnDocument: 'after' }
                )
                .exec()
                .then(result => {
                    req.session.user = result;
                    req.session.save();

                    res.json({ success: true, message: 'Successfully linked your metamask account.' });
                })
                .catch(err => logger.error(NAMESPACE, err.message, err));
            } else {
                res.json({ success: false, message: 'Couldn\'t verify address belongs to you, please try again with your own.' });
            }
        }
    }
}