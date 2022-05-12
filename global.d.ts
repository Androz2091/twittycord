declare namespace NodeJS {
    interface ProcessEnv {
        APP_NAME: string,
        APP_ENV: string,

        SERVER_PORT: string,
        SERVER_HOSTNAME: string,
        SERVER_SCHEME: string,
        
        MONGO_USERNAME: string,
        MONGO_PASSWORD: string,
        MONGO_HOSTNAME: string,
        MONGO_DBNAME: string,
        
        DISCORD_CLIENT_ID: string,
        DISCORD_CLIENT_SECRET: string,
        DISCORD_CALLBACK_PATH: string,
        
        TWITTER_CONSUMER_KEY: string,
        TWITTER_CONSUMER_SECRET: string,
        TWITTER_CLIENT_ID: string,
        TWITTER_CLIENT_SECRET: string,
        TWITTER_CALLBACK_PATH: string,

        MAX_CLUSTERS: string,
    }
}