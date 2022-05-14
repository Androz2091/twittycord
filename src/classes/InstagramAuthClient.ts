import { Request, Response, NextFunction } from 'express';
import fetch from 'node-fetch';

export default class InstagramAuthClient {
    private api: string = 'https://api.instagram.com/';
    private graphApi: string = 'https://graph.instagram.com/';
    
    private appId: string;
    private appSecret: string;
    private scopes: string[];
    private redirectURI: string;
    private responseType: string = 'code';
    private userNodeFields: string[] = ['id', 'username'];

    private failureRedirect?: string;
    
    constructor (options: InstagramAuthClientOptions) {
        this.appId = options.appId;
        this.appSecret = options.appSecret;
        this.scopes = options.scopes;
        this.redirectURI = options.redirectURI;
    }

    public authenticate(options?: InstagramAuthenticateOptions) {
        if (options && options.failureRedirect) {
            this.failureRedirect = options.failureRedirect;
            return this.handleAuth.bind(this);
        } else return this.redirectToAuth.bind(this);
    }

    private redirectToAuth(req: Request, res: Response, next: NextFunction) {
        let link = this.api + 'oauth/authorize'
            + '?client_id=' + this.appId
            + '&redirect_uri=' + this.redirectURI
            + '&scope=' + this.scopes.join(',')
            + '&response_type=' + this.responseType;
        
        return res.redirect(link);
    }

    private async handleAuth(req: Request, res: Response, next: NextFunction) {
        let failureRedirect = this?.failureRedirect;
        if (!failureRedirect) throw Error('Failure redirect not provided for auth handler');

        let code = req.query?.code;
        
        if (!code) {
            req.flash('error', 'You denied to authenticate with Instagram, or session expired, please try again.');
            return res.redirect(failureRedirect);
        }

        if ((code as string).endsWith('#_')) code = (code as string).replace('#_', '');

        let oauthTokenApiURL = this.api + 'oauth/access_token';
        
        let params = new URLSearchParams();
            params.append('client_id', this.appId)
            params.append('client_secret', this.appSecret)
            params.append('grant_type', 'authorization_code')
            params.append('redirect_uri', this.redirectURI)
            params.append('code', (code as string))
        
        let oauthTokenResponse = await fetch(oauthTokenApiURL, { method: 'POST', body: params });

        let { access_token, user_id }: any = await oauthTokenResponse.json();
        
        if (!access_token || !user_id) {
            req.flash('error', 'Failed to authenticate with Instagram, please try again.');
            return res.redirect(failureRedirect);
        }

        let userNodeApiURL = this.graphApi + 'me'
            + '?fields=' + this.userNodeFields.join(',')
            + '&access_token=' + access_token;
        
        let userNodeResponse = await fetch(userNodeApiURL);
        let { id, username }: any = await userNodeResponse.json();
    
        if (!id || !username) return res.redirect(failureRedirect);

        req.session.instagramUserProfile = { accountId: id, accountDisplayName: username };
        req.session.save();

        return next();
    }
}

interface InstagramAuthenticateOptions {
    failureRedirect?: string, 
}

interface InstagramAuthClientOptions {
    appId: string,
    appSecret: string,
    scopes: string[],
    redirectURI: string
}