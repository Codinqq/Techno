const mongoose = require("mongoose");

const backupSchema = mongoose.Schema({
    guildID: String,
    date: String,
    guild: String,
    chats: Array,
    channels: Array,
    roles: Array,
    bans: Array,
    members: Array
});

module.exports = mongoose.model("Backup", backupSchema);