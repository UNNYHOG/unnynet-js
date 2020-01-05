import DefaultSocial from "./DefaultSocial";
import UnnyNet from "../UnnyNet";

export default class Facebook extends DefaultSocial {

    authorize(callback) {
        this._initializeFacebook(() => {
            this.API.authWithFB(this.env, this.accessToken, callback);//TODO fix it
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

                this.accessToken = response.authResponse.accessToken;
                this.fbUserID = response.authResponse.userID;

                if (callback)
                    callback();
            };

            const checkStatus = (response) => {
                console.info("FB STATUS", response);
                if (response.status === 'connected') {
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token
                    // and signed request each expire
                    // var uid = response.authResponse.userID;
                    onLogin(response);
                } else {
                    FB.login((response) => {
                        checkStatus(response);
                    }, {scope: 'email'});
                }
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
