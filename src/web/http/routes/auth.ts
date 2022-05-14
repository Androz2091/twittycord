import { Router } from "express";
import controller from "../controllers/auth";
import passport from "passport";
import middlewares from "../middlewares";
import InstagramAuthClient from "../../../classes/InstagramAuthClient";
import config from "../../../config";

const router = Router();

const instagram = new InstagramAuthClient(config.instagram);

router.get('/discord', middlewares.discordGuest, passport.authenticate('discord'));
router.get('/discord/callback', middlewares.discordGuest, passport.authenticate('discord', { failureRedirect: '/' }), controller.discord.authenticated);
router.get('/discord/logout', middlewares.discordAuth, controller.discord.logout);

router.get('/twitter', middlewares.discordAuth, middlewares.twitterGuest, controller.twitter.authenticate);
router.get('/twitter/callback', middlewares.discordAuth, middlewares.twitterGuest, controller.twitter.callback);

router.get('/instagram', middlewares.discordAuth, middlewares.instagramGuest, instagram.authenticate());

router.get(
    '/instagram/callback',
    middlewares.discordAuth,
    middlewares.instagramGuest,
    instagram.authenticate({ failureRedirect: '/user/dashboard' }),
    controller.instagram.authenticated
);

export default router;