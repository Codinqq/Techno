/*
  _____         _                   ____    ___
 |_   _|__  ___| |__  _ __   ___   |___ \  / _ \
   | |/ _ \/ __| '_ \| '_ \ / _ \    __) || | | |
   | |  __/ (__| | | | | | | (_) |  / __/ | |_| |
   |_|\___|\___|_| |_|_| |_|\___/  |_____(_)___/

    Made by Codinq 2019.
*/
const config = require("./config.json");

// Discord
const Discord = require("discord.js");
const client = new Discord.Client();

// Packages
const mongoose = require("mongoose");

// Models
const CustomCmds = require("./models/customcmds.js");
const Dashboard = require("./models/dashboard.js");
const Users = require("./models/users.js");

// Connect to the database.
mongoose.connect(config.mongoose, { useNewUrlParser: true, useUnifiedTopology: true });

client.on("ready", async () => {
    let ready = require("./Events/ready.js");
    ready.run(client, config);
});

client.on("messageUpdate", (oldMessage, newMessage) => {
    let messageUpdate = require("./Events/messageUpdate.js");
    messageUpdate.run(client, oldMessage, newMessage, config);
});

client.on("messageDelete", async (message) => {
    let messageDelete = require("./Events/messageDelete.js");
    messageDelete.run(client, message, config);
});

client.on("guildMemberAdd", async (member) => {
    let guildMemberAdd = require("./Events/guildMemberAdd.js");
    guildMemberAdd.run(client, member, config);
});

client.on("guildMemberRemove", async (member) => {
    let guildMemberRemove = require("./Events/guildMemberRemove.js");
    guildMemberRemove.run(client, member, config);
});

client.on("guildDelete", async guild => {
    let guildDelete = require("./Events/guildDelete.js");
    guildDelete.run(client, guild, config);
});

client.on("guildCreate", async guild => {
    let guildCreate = require("./Events/guildCreate.js");
    guildCreate.run(client, guild, config);
});

client.on("roleUpdate", async (oldRole, newRole) => {
    let roleUpdate = require("./Events/roleUpdate.js");
    roleUpdate.run(client, oldRole, newRole, config);
})

client.on("roleDelete", async (role) => {
    let roleDelete = require("./Events/roleDelete.js");
    roleDelete.run(client, role, config);
})

client.on("roleCreate", async (role) => {
    let roleCreate = require("./Events/roleCreate.js");
    roleCreate.run(client, role, config);
})

client.on("guildUpdate", async (oldGuild, newGuild) => {
    let guildUpdate = require("./Events/guildUpdate.js");
    guildUpdate.run(client, oldGuild, newGuild, config);
})

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    let guildMemberUpdate = require("./Events/guildMemberUpdate.js");
    guildMemberUpdate.run(client, oldMember, newMember, config);
})

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    let emojiUpdate = require("./Events/emojiUpdate.js");
    emojiUpdate.run(client, oldEmoji, newEmoji, config);
})

client.on("emojiCreate", async (emoji) => {
    let emojiCreate = require("./Events/emojiCreate.js");
    emojiCreate.run(client, emoji, config);
})

client.on("emojiDelete", async (emoji) => {
    let emojiDelete = require("./Events/emojiDelete.js");
    emojiDelete.run(client, emoji, config);
})

client.on("guildBanAdd", async (guild, user) => {
    let guildBanAdd = require("./Events/guildBanAdd.js");
    guildBanAdd.run(client, guild, user, config);
})

client.on("guildBanRemove", async (guild, user) => {
    let guildBanRemove = require("./Events/guildBanRemove.js");
    guildBanRemove.run(client, guild, user, config);
})

client.on("channelCreate", async (channel) => {
    let channelCreate = require("./Events/channelCreate.js");
    channelCreate.run(client, channel, config);
})

client.on("channelDelete", async (channel) => {
    let channelDelete = require("./Events/channelDelete.js");
    channelDelete.run(client, channel, config);
})

client.on("channelUpdate", async (oldChannel, newChannel) => {
    let channelUpdate = require("./Events/channelUpdate.js");
    channelUpdate.run(client, oldChannel, newChannel, config);
})

client.on("error", err => console.log(err.stack));

client.on("message", async message => {
    let messageEvent = require("./Events/message.js");
    messageEvent.run(client, message, config);
});
//client.login(config.otoken); // Official
client.login(config.btoken); // Canary