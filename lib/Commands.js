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
    WrongAchievementType: 13,
    AchievementIsNotPublished: 14,
    LeaderboardReportsTooOften: 15,
    NoAccessToken: 16,
};

export default class UnnynetCommand {
    static Command = {
        OpenLeaderBoards: 1,
        OpenAchievements: 2,
        OpenFriends: 3,
        OpenChannel: 4,
        OpenGuilds: 5,
        OpenMyGuild: 6,
        SetSafeArea: 7,
        SendMessage: 20,
        UnnyNetWasOpened: 30,
        ReportLeaderboardScoresAsync: 40,
        ReportAchievementProgressAsync: 41,
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
        GetLeaderboardScores: 150,
        JoinPrivateChannel: 160,
        LeaveAllPrivateChannels: 161,
    };

    static jsCommands = {
        [UnnynetCommand.Command.OpenLeaderBoards]: "window.globalReactFunctions.apiOpenLeaderboards();",
        [UnnynetCommand.Command.OpenAchievements]: "window.globalReactFunctions.apiOpenAchievements();",
        [UnnynetCommand.Command.OpenFriends]: "window.globalReactFunctions.apiOpenFriends();",
        [UnnynetCommand.Command.OpenChannel]: "window.globalReactFunctions.apiOpenChannel('{0}');",
        [UnnynetCommand.Command.OpenGuilds]: "window.globalReactFunctions.apiOpenGuilds();",
        [UnnynetCommand.Command.OpenMyGuild]: "window.globalReactFunctions.apiOpenMyGuild();",
        [UnnynetCommand.Command.SendMessage]: "window.globalReactFunctions.apiSendMessage('{0}', '{1}');",
        [UnnynetCommand.Command.UnnyNetWasOpened]: "window.globalReactFunctions.apiUnnyNetWasOpened();",
        [UnnynetCommand.Command.ReportLeaderboardScoresAsync]: "window.globalReactFunctions.apiReportLeaderboardScoresAsync(<*id*>, '{0}', {1}, '{2}');",
        [UnnynetCommand.Command.ReportAchievementProgressAsync]: "window.globalReactFunctions.apiReportAchievementProgressAsync(<*id*>, {0}, {1});",
        [UnnynetCommand.Command.AddGuildExperience]: "window.globalReactFunctions.apiAddGuildExperience('{0}');",
        [UnnynetCommand.Command.RequestFailed]: "window.globalReactFunctions.requestFailed('{0}', \"{1}\");",
        [UnnynetCommand.Command.RequestSucceeded]: "window.globalReactFunctions.requestSucceeded('{0}');",
        [UnnynetCommand.Command.RequestReply]: "window.globalReactFunctions.requestReply('{0}', '{1}');",
        [UnnynetCommand.Command.SetKeyboardOffset]: "window.globalReactFunctions.apiSetKeyboardOffset('{0}');",
        [UnnynetCommand.Command.SetConfig]: "window.globalReactFunctions.apiSetConfig('{0}');",
        [UnnynetCommand.Command.SetDefaultChannel]: "window.globalReactFunctions.apiSetDefaultChannel('{0}');",
        [UnnynetCommand.Command.AuthorizeWithCredentials]: "window.globalReactFunctions.apiAuthWithCredentials('{0}', '{1}', '{2}');",
        [UnnynetCommand.Command.AuthorizeAsGuest]: "window.globalReactFunctions.apiAuthAsGuest('{0}');",
        [UnnynetCommand.Command.AuthorizeWithCustomId]: "window.globalReactFunctions.apiAuthWithCustomId('{0}', '{1}');",
        [UnnynetCommand.Command.ForceLogout]: "window.globalReactFunctions.apiForceLogout();",
        [UnnynetCommand.Command.GetGuildInfo]: "window.globalReactFunctions.apiGetGuildInfo(<*id*>, {0});",
        [UnnynetCommand.Command.SetSafeArea]: "window.globalReactFunctions.apiSetSafeArea({0}, {1}, {2}, {3});",
        [UnnynetCommand.Command.GetAchievementsInfo]: "window.globalReactFunctions.apiGetAchievementsInfo(<*id*>);",
        [UnnynetCommand.Command.GetPlayerPublicInfo]: "window.globalReactFunctions.apiGetPlayerPublicInfo(<*id*>);",
        [UnnynetCommand.Command.GetLeaderboardScores]: "window.globalReactFunctions.apiGetLeaderboardScores(<*id*>, '{0}');",
        [UnnynetCommand.Command.JoinPrivateChannel]: "window.globalReactFunctions.apiJoinPrivateChannel(<*id*>, '{0}', '{1}');",
        [UnnynetCommand.Command.LeaveAllPrivateChannels]: "window.globalReactFunctions.apiLeaveAllPrivateChannels(<*id*>);"
    };

    static GetCommand(cmd) {
        return UnnynetCommand.jsCommands[cmd];
    }

    static getResponceData(data) {
        const response = {};

        if (data.error) {
            response.success = false;
            response.error = data.error;
        } else
            response.success = true;

        if (data.data)
            response.data = data.data;

        return response;
    }

    /**
     *
     * @param {int} code
     * @param {string} message
     * @returns {{success: boolean, error: {code: *, message: *}}}
     */
    static getErrorResponse(code, message = "") {
        return {
            success: false,
            error: {
                code: code,
                message: message
            }
        }
    }

    static getSuccessResponse(data = null) {
        const response = {
            success: true,
        };

        if (data)
            response.data = data;

        return response;
    }
}
