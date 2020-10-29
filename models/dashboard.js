const mongoose = require("mongoose");

const dashboardSchema = mongoose.Schema({
    guildID: String,
    prefix: String,
    blacklisted: {
        blacklisted: Boolean,
        message: String,
        blacklister: String,
    },
    channels: {
        botLogs: String,
    },
    addons: {
        automod: {
            noSwear: Boolean,
            noSpam: Boolean,
            noLinks: Boolean
        },
        advancedLogs: {
            messageEdited: Boolean,
            messageRemove: Boolean,
            emojiEdited: Boolean,
            banAdd: Boolean,
            memberUpdate: Boolean,
            guildUpdate: Boolean,
            roleUpdate: Boolean,
            channelUpdate: Boolean
        },
        levels: {
            enabled: Boolean,
            levelupMessage: String,
        },
        memberLogs: {
            enabled: Boolean,
            joinRole: String,
            messages: {
                join: String,
                leave: String
            },
            channel: String
        }
    }
});

module.exports = mongoose.model("Dashboard", dashboardSchema);