import bodyParser from 'body-parser';
import express from 'express';
import { join } from 'path';
import passport from 'passport';
import { Strategy } from 'passport-discord';
import OAuth2Strategy from 'passport-oauth2';
import mongoose from 'mongoose';
import fs from 'fs';

import config from './config';
import logger from './utils/logger';
import UserInterface from './interfaces/UserInterface';

import { Edge } from 'edge.js';
const edge = new Edge({ cache: config.app.env == 'production' });
edge.mount(join(__dirname, 'web/resources/views'));

import * as routes from './web/http/routes/index';

import expressSession from 'express-session';
declare module 'express-session' {
    interface SessionData {
      codeVerifier?: string;
      state?: string;
      discordProfile?: Strategy.Profile,
      user: UserInterface & { _id: any } | null
    }
}

const NAMESPACE = 'Server';

/** DATABASE CONNECTION */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(res => logger.log(NAMESPACE, `[PID: ${process.pid}] Connected to MongoDB!`))
    .catch(err => logger.error(NAMESPACE, err.message, err));

/** PASSPORT CONFIG FOR DISCORD AUTH */
const discordStrategy = new Strategy(config.discord,
    (accessToken: string, refreshToken: string, profile: Strategy.Profile, done: OAuth2Strategy.VerifyCallback) => {
		process.nextTick(() => done(null, profile));
    }
);

passport.use(discordStrategy);
passport.serializeUser((user, done) => {
    done(null, user)
});
passport.deserializeUser((user, done) => {
    done(null, user as any);
});

/** HTTP SERVER CONFIG */
const server = express();

server.engine('edge', (path: string, options: object, callback: Function) => {
    fs.readFile(path, 'utf-8', async (err, content) => {
        if (err) return callback(err);
        return callback(null, await edge.renderRaw(content.toString(), options))
    });
});

server.set('views', join(__dirname, 'web/resources/views'));
server.set('view engine', 'edge');

server.use(expressSession({
    secret: config.server.sessionSecret,
    resave: false,
    saveUninitialized: false
}));
server.use(passport.initialize());
server.use(passport.session());

server.use((req, res, next) => {
    edge.GLOBALS.user = Object.assign({ isAuthenticated: req.isAuthenticated() }, (req.user || {}))

    return next();
});

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use('/public/assets', express.static(join(__dirname, 'web/resources/assets')))

server.use('/', routes.home);
server.use('/auth', routes.auth);
server.use('/api', routes.api);
server.use('/user/dashboard', routes.dashboard);

server.get('*', (req, res) => {
    res.render('error', { error: { code: '404', message: 'Uh oh! this is a 404 page, please go home' } })
})

server.listen(config.server.port, () => logger.log(NAMESPACE, `[PID: ${process.pid}] Server listening to port: ${config.server.port}`));