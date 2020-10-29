const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userID: String,
    guildID: String,
    applicationEdit: Boolean,
    levels: {
        level: Number,
        xp: Number,
        messages: Number,
    },
    settings: {
        afk: {
            enabled: String,
            message: String
        }
    }
});

module.exports = mongoose.model("User", userSchema);