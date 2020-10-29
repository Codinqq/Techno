const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
const moment = require("moment");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {
        if (err) return console.log(err);

        msg.delete();


        let userEmbed = new Discord.RichEmbed()
            .setColor(config.color)
            .setThumbnail(msg.guild.iconURL)
            .setDescription(`**Guild Information**\n> Name \`${msg.guild.name}\`\n> Id \`${msg.guild.id}\`\n> Owner \`${msg.guild.owner.user.tag}\`\n> Created-Date \`${moment.utc(msg.guild.createdAt).format("MMM Do YYYY, HH:mm")} UTC\`\n\n> Total Members \`${msg.guild.memberCount}\`\n> Total Bots \`${msg.guild.members.filter(m => m.user.bot).size}\`\n> Total Users \`${msg.guild.members.filter(m => !m.user.bot).size}\`\n\n> Total Online Members \`${msg.guild.members.filter(m => m.presence.status === "online").size + msg.guild.members.filter(m => m.presence.status === "dnd").size + msg.guild.members.filter(m => m.presence.status === "idle").size}\`\n> Offline Members \`${msg.guild.members.filter(m => m.presence.status === "offline").size}\``)

        return msg.channel.send(userEmbed);

    });
};