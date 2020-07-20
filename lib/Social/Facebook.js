import DefaultSocial from "./DefaultSocial";
import UnnyNet from "../UnnyNet";
import Auth from "../Auth";

export default class Facebook extends DefaultSocial {

    constructor(unnyNetBase) {
        super(unnyNetBase);
        this.fb_app_id = unnyNetBase.config.fb_app_id;
    }

    authorize(callback) {
        console.error("11");
        this._initializeFacebook(() => {
            // console.warn("INITIALIZED -> auth");
            // UnnyNet.authorize('test_user1', 'test_password', callback);
            this.accessToken = "EAAKyKjDYwlkBABwUNjauv2mUOm5ZBBpBiZA5cXmxbOEFrZBeCdMAqVhtZAhSoTd1CxUO70iWunsBPGZClWXCBiOUT2NoyLkC4O9HI2sKzcDpuk3zZB1jHTGux72UrVBtPbKqbskwO0RtyIZBEb8QZB3ZCixPHavyPkAn5xo4u7FK4qcXgTciuPdkDLHpuRblSyVJFBWcWLHVD6wZDZD";
            this.API.authWithFB(this.accessToken, callback);
            // this._autoAuthInNakama();
            // callback();
        });
    }

    _autoAuthInNakama() {
        Auth.authorizeAsGuest("");//TODO take name from FB
    }

    // getDeviceIdForNakama() {
    //     return "facebook_" + "user_id";//TODO fix it
    // }

    _initializeFacebook(callback) {
        if (window === top) {//not an iframe
            if (callback)
                callback();
            return;
        }

        window.fbAsyncInit = () => {
            FB.init({
                appId: this.fb_app_id, //TODO find how to get it
                cookie: true,
                xfbml: true,
                version: 'v3.3'
            });

            FB.AppEvents.logPageView();

            const onLogin = (response) => {
                this.accessToken = response.authResponse.accessToken;
                this.fbUserID = response.authResponse.userID;

                FB.api('/me', {locale: 'en_US', fields: 'name, picture, email'}, (response) => {//TODO learn how to get bigger picture than 50px
                    console.info(response);

                    //email is mandatory
                    if (!response.hasOwnProperty('email'))
                        login(true);
                    else {
                        this.fbUserEmail = response.email;
                        this.fbUserName = response.name;
                        if (callback)
                            callback();
                    }
                });
            };

            const login = (rerequest) => {
                const data = {
                    scope: 'email'
                };

                if (rerequest)
                    data.auth_type = 'rerequest';

                FB.login((response) => {
                    checkStatus(response);
                }, data);
            };

            const checkStatus = (response) => {
                console.info("FB STATUS", response);
                if (response.status === 'connected') {
                    onLogin(response);
                } else
                    login();
            };

            FB.getLoginStatus((response) => {
                checkStatus(response);
            });
        };

        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
}
