const mongoose = require("mongoose");

const customCmdSchema = mongoose.Schema({
    guildID: String,
    cmdName: String,
    cmdInfo: String,
    cmdResponse: String,
    prefix: Boolean
});

module.exports = mongoose.model("CustomCMDS", customCmdSchema);