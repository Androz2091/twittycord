import { Router } from "express";
import controller from "../controllers/auth";
import passport from "passport";
import middlewares from "../middlewares";

const router = Router();

router.get('/discord', middlewares.discordGuest, passport.authenticate('discord'));
router.get('/discord/callback', middlewares.discordGuest, passport.authenticate('discord', { failureRedirect: '/' }), controller.discord.authenticated);
router.get('/discord/logout', middlewares.discordAuth, controller.discord.logout);

router.get('/twitter', middlewares.discordAuth, middlewares.twitterGuest, controller.twitter.authenticate);
router.get('/twitter/callback', middlewares.discordAuth, middlewares.twitterGuest, controller.twitter.callback);

export default router;