const mongoose = require("mongoose");

const blackListSchema = mongoose.Schema({
    userID: String,
    blacklisted: Boolean,
    reason: String,
    blacklister: String,
});

module.exports = mongoose.model("Blacklist", blackListSchema);