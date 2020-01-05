import DefaultSocial from "./DefaultSocial";
import UnnyNet from "../UnnyNet";

export default class FacebookInstant extends DefaultSocial {

    authorize(callback) {
        this._initializeFacebook(() => {
            this.API.authWithFB(this.environment, this.accessToken, callback);
            // this._autoAuthInNakama();
        });
    }

    // _autoAuthInNakama() {
    //     UnnyNet.authorizeAsGuest("");//TODO take name from FB
    // }

    // getDeviceIdForNakama() {
    //     return "facebook_" + "user_id";//TODO fix it
    // }

    _initializeFacebook(callback) {

        const scriptWasLoaded = () => {
            console.error("scriptWasLoaded");
            FBInstant.initializeAsync()
                .then(function () {
                    console.log("LOAD");

                    FBInstant.startGameAsync()
                        .then(function () {
                            // Retrieving context and player information can only be done
                            // once startGameAsync() resolves
                            var contextId = FBInstant.context.getID();
                            var contextType = FBInstant.context.getType();

                            var playerPic = FBInstant.player.getPhoto();

                            // Once startGameAsync() resolves it also means the loading view has
                            // been removed and the user can see the game viewport

                            // this.fbUserEmail = response.email;
                            this.fbUserID = FBInstant.player.getID();
                            this.fbUserName = FBInstant.player.getName();

                            console.info("PLAYERID " + this.fbUserID + " <> " + this.fbUserName, playerPic);
                            if (callback)
                                callback();
                        });
                });
        };

        (function (d, s, id) {
            let js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/fbinstant.6.3.js";
            js.onload = scriptWasLoaded;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
}
