const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    userID: String,
    moderator: Boolean,
    admin: Boolean,
    owner: Boolean,
    blacklistedUsers: {[String]: {
        reason: String,
        blacklisted: Boolean,
    }},
});

module.exports = mongoose.model("Admin", adminSchema);