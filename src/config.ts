import dotenv from 'dotenv';

/* LOAD process.env */
dotenv.config();

/* APP CONFIG */
const APP_NAME = process.env.APP_NAME;
const APP_ENV = process.env.APP_ENV;

const APP = {
    name: APP_NAME,
    env: APP_ENV
}


/* SERVER CONFIG */
const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME;
const SERVER_SCHEME = process.env.SERVER_SCHEME;
const SERVER_URL = SERVER_SCHEME + '://' + SERVER_HOSTNAME + (APP.env === 'local' ? ':' + SERVER_PORT : '');
const SESSION_SECRET = 'JUST_A_RANDOM_STRING';

const SERVER = {
    port: SERVER_PORT,
    hostname: SERVER_HOSTNAME,
    scheme: SERVER_SCHEME,
    url: SERVER_URL,
    sessionSecret: SESSION_SECRET
}

/* DATABASE CONFIG */
const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false
}

const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_DBNAME = process.env.MONGO_DBNAME;
const MONGO_URL = 'mongodb://' + MONGO_USERNAME + ':' + MONGO_PASSWORD + '@' + MONGO_HOSTNAME + '/' + MONGO_DBNAME;

const MONGO = {
    host: MONGO_HOSTNAME,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: MONGO_URL
}

/* DISCORD CLIENT CONFIG */
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || 'DISCORD_CLIENT_ID';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || 'DISCORD_CLIENT_SECRET';
const DISCORD_CALLBACK_PATH = process.env.DISCORD_CALLBACK_PATH;
const DISCORD_AUTH_SCOPES = ['identify', 'email'];

const DISCORD = {
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: SERVER_URL + DISCORD_CALLBACK_PATH,
    scope: DISCORD_AUTH_SCOPES
}

/* TWITTER CLIENT CONFIG */
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID || 'TWITTER_CLIENT_ID';
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET || 'TWITTER_CLIENT_SECRET';
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY || 'TWITTER_CONSUMER_KEY';
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET || 'TWITTER_CONSUMER_SECRET';
const TWITTER_CALLBACK_PATH = process.env.TWITTER_CALLBACK_PATH;
const TWITTER_AUTH_SCOPES = ['tweet.read', 'users.read', 'offline.access'];

const TWITTER = {
    clientId: TWITTER_CLIENT_ID,
    clientSecret: TWITTER_CLIENT_SECRET,
    appKey: TWITTER_CONSUMER_KEY,
    appSecret: TWITTER_CONSUMER_SECRET,
    callbackURI: SERVER_URL + TWITTER_CALLBACK_PATH,
    scopes: TWITTER_AUTH_SCOPES
}

/* INSTAGRAM CLIENT CONFIG */
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID || 'INSTAGRAM_APP_ID';
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET || 'INSTAGRAM_APP_SECRET';
const INSTAGRAM_CALLBACK_PATH = process.env.INSTAGRAM_CALLBACK_PATH;
const INSTAGRAM_REDIRECT_URI = SERVER_URL + INSTAGRAM_CALLBACK_PATH;
const INSTAGRAM_AUTH_SCOPES = ['user_profile', 'user_media'];

const INSTAGRAM = {
    appId: INSTAGRAM_APP_ID,
    appSecret: INSTAGRAM_APP_SECRET,
    redirectURI: INSTAGRAM_REDIRECT_URI,
    scopes: INSTAGRAM_AUTH_SCOPES
}

export default { app: APP, server: SERVER, mongo: MONGO, discord: DISCORD, twitter: TWITTER, instagram: INSTAGRAM }