import DefaultSocial from "./DefaultSocial";
import UnnyNet from "../UnnyNet";

export default class Facebook extends DefaultSocial {

    authorize(callback) {
        this._initializeFacebook(() => {
            this.API.authWithFB(this.environment, this.accessToken, callback);
            // this._autoAuthInNakama();
        });
    }

    _autoAuthInNakama() {
        UnnyNet.authorizeAsGuest("");//TODO take name from FB
    }

    // getDeviceIdForNakama() {
    //     return "facebook_" + "user_id";//TODO fix it
    // }

    _initializeFacebook(callback) {
        window.fbAsyncInit = () => {
            FB.init({
                appId: 758844231303769, //TODO find how to get it
                cookie: true,
                xfbml: true,
                version: 'v3.3'
            });

            FB.AppEvents.logPageView();

            const onLogin = (response) => {
                console.info("FB onLogin", response);

                //email is mandatory
                const scopes = response.authResponse.grantedScopes;
                if (scopes.indexOf('email') === -1) {
                    login(true);
                } else {
                    this.accessToken = response.authResponse.accessToken;
                    this.fbUserID = response.authResponse.userID;

                    FB.api('/me', {locale: 'en_US', fields: 'name, picture, email'}, (response) => {
                        console.info(response);
                        this.fbUserEmail = response.email;
                        this.fbUserName = response.name;
                        if (callback)
                            callback();
                    });
                }
            };

            const login = (rerequest) => {
                const data = {
                    scope: 'email',
                    return_scopes: true
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
