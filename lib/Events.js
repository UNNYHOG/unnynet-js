import UnnyBaseObject from "./UnnyBaseObject";

export default class Events {

    static onPlayerAuthorized;
    static onPlayerLoggedOut;
    static onUnnyNetClosed;
    static onPlayerNameChanged;
    static onRankChanged;
    static onNewGuild;
    static onAchievementCompleted;
    static onNewMessageReceived;
    static onGameLoginRequest;
    static onNewGuildRequest;
    static onPopupOpened;

    //This method is called for FB Instant only for now. It has 2 parameters: [1] send loading progress, [2] tell that everything is loaded
    static onLoadingProgress;
}
