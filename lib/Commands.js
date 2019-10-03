export const Errors = {
    NotInitialized: -1,
    Unknown: 1,
    NotAuthorized: 2,
    NoMessage: 3,
    NoChannel: 4,
    UnnynetNotReady: 5,
    NoGameId: 6,
    NoSuchLeaderboard: 7,
    NoLeaderboardsForTheGame: 8,
    NoAchievementsForTheGame: 9,
    NoGuildsForTheGame: 10,
    NotInGuild: 11,
    NoSuchAchievement: 12,
    WrongAchievementType: 13
};

export default class UnnyCommands {
    static Command = {
        OpenLeaderBoards: 1,
        OpenAchievements: 2,
        OpenFriends: 3,
        OpenChannel: 4,
        OpenGuilds: 5,
        OpenMyGuild: 6,
        SetSafeArea: 7,
        SendMessage: 20,
        ReportLeaderboardScores: 40,
        ReportAchievementProgress: 41,
        AddGuildExperience: 60,
        RequestFailed: 70,//obsolute
        RequestSucceeded: 71,//obsolute
        RequestReply: 72,
        SetKeyboardOffset: 80,
        SetConfig: 81,
        SetDefaultChannel: 82,
        AuthorizeWithCredentials: 100,
        AuthorizeAsGuest: 101,
        AuthorizeWithCustomId: 102,
        ForceLogout: 110,
        GetGuildInfo: 120,
        GetAchievementsInfo: 130,
        GetPlayerPublicInfo: 140,
        GetLeaderboardScores: 150
    };

    static jsCommands = {
        [UnnyCommands.Command.OpenLeaderBoards]: "window.globalReactFunctions.apiOpenLeaderboards();",
        [UnnyCommands.Command.OpenAchievements]: "window.globalReactFunctions.apiOpenAchievements();",
        [UnnyCommands.Command.OpenFriends]: "window.globalReactFunctions.apiOpenFriends();",
        [UnnyCommands.Command.OpenChannel]: "window.globalReactFunctions.apiOpenChannel('{0}');",
        [UnnyCommands.Command.OpenGuilds]: "window.globalReactFunctions.apiOpenGuilds();",
        [UnnyCommands.Command.OpenMyGuild]: "window.globalReactFunctions.apiOpenMyGuild();",
        [UnnyCommands.Command.SendMessage]: "window.globalReactFunctions.apiSendMessage('{0}', '{1}');",
        [UnnyCommands.Command.ReportLeaderboardScores]: "window.globalReactFunctions.apiReportLeaderboardScores('{0}', {1});",
        [UnnyCommands.Command.ReportAchievementProgress]: "window.globalReactFunctions.apiReportAchievementProgress({0}, {1});",
        [UnnyCommands.Command.AddGuildExperience]: "window.globalReactFunctions.apiAddGuildExperience('{0}');",
        [UnnyCommands.Command.RequestFailed]: "window.globalReactFunctions.requestFailed('{0}', \"{1}\");",
        [UnnyCommands.Command.RequestSucceeded]: "window.globalReactFunctions.requestSucceeded('{0}');",
        [UnnyCommands.Command.RequestReply]: "window.globalReactFunctions.requestReply('{0}', '{1}');",
        [UnnyCommands.Command.SetKeyboardOffset]: "window.globalReactFunctions.apiSetKeyboardOffset('{0}');",
        [UnnyCommands.Command.SetConfig]: "window.globalReactFunctions.apiSetConfig('{0}');",
        [UnnyCommands.Command.SetDefaultChannel]: "window.globalReactFunctions.apiSetDefaultChannel('{0}');",
        [UnnyCommands.Command.AuthorizeWithCredentials]: "window.globalReactFunctions.apiAuthWithCredentials('{0}', '{1}', '{2}');",
        [UnnyCommands.Command.AuthorizeAsGuest]: "window.globalReactFunctions.apiAuthAsGuest('{0}');",
        [UnnyCommands.Command.AuthorizeWithCustomId]: "window.globalReactFunctions.apiAuthWithCustomId('{0}', '{1}');",
        [UnnyCommands.Command.ForceLogout]: "window.globalReactFunctions.apiForceLogout();",
        [UnnyCommands.Command.GetGuildInfo]: "window.globalReactFunctions.apiGetGuildInfo(<*id*>, {0});",
        [UnnyCommands.Command.SetSafeArea]: "window.globalReactFunctions.apiSetSafeArea({0}, {1}, {2}, {3});",
        [UnnyCommands.Command.GetAchievementsInfo]: "window.globalReactFunctions.apiGetAchievementsInfo(<*id*>);",
        [UnnyCommands.Command.GetPlayerPublicInfo]: "window.globalReactFunctions.apiGetPlayerPublicInfo(<*id*>);",
        [UnnyCommands.Command.GetLeaderboardScores]: "window.globalReactFunctions.apiGetLeaderboardScores(<*id*>, '{0}');",
    };

    static GetCommand(cmd) {
        return UnnyCommands.jsCommands[cmd];
    }

    static getResponceData(data) {
        const response = {};

        if (data.error) {
            response.success = false;
            response.error = JSON.parse(data.error);
        } else
            response.success = true;

        if (data.data)
            response.data = JSON.parse(data.data);

        return response;
    }
}