const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
const moment = require("moment");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    Dashboard.findOne({guildID: msg.guild.id}, async (err, guild) => {
        if(err) return console.log(err);

        let userMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.find(m => m.id === args[0]);
        let userTag;
        let userUser;
        let userM;
        let userCreated;
        if(!userMember) {
            userMember = msg.author;
            userTag = msg.author;
            userUser = msg.user;
            userM = msg.member;
            userCreated = msg.member.user.createdAt
        } else {
            userTag = userMember.user;
            userUser = userMember.user;
            userM = userMember;
            userCreated = userMember.user.createdAt
        }

       await Users.findOne({userID: userMember.id, guildID: msg.guild.id}, async (err, user) => {
            msg.delete();
        if(err) return console.log(err);

            let presence = "";
            if(userMember.presence.status === "dnd") {
                presence = "Do Not Disturb"
            }
            if(userMember.presence.status === "online") {
                presence = "Online"
            }
            if(userMember.presence.status === "idle") {
                presence = "Idle"
            }
            if(userMember.presence.status === "offline") {
                presence = "Offline / Invisible"
            }

            let presenceRes = userMember.presence.game;
            if(presenceRes === "null" || !presenceRes) {
                presenceRes = "Not playing anything."
            }

            let userEmbed = await new Discord.RichEmbed()
            .setColor(config.color)
            .setThumbnail(userTag.displayAvatarURL)
            .setDescription(`**User information**\n> Name \`${userTag.tag}\`\n> ID \`${userMember.id}\`\n> Presence \`${presenceRes}\`\n> Status \`${presence}\`\n\n> Join-Date \`${moment.utc(userM.joinedAt).format("MMMM Do YYYY, HH:mm")} UTC\`\n> User Created At \`${moment.utc(userCreated).format("MMM Do YYYY, HH:mm")} UTC\``)
            .setFooter(`To look the user information of a another user, use "${guild.prefix}user <user-tag || user-id>"`);

            return msg.channel.send(userEmbed);
        });
});
};