const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
    guildID: String,
    name: String,
    questions: [String]
});

module.exports = mongoose.model("Application", appSchema);