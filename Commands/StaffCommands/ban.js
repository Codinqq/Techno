const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    let userMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(m => m.id === args[0]);
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {
        if (err) return console.log(err);

        if (!msg.member.hasPermission("BAN_MEMBERS")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Ban** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`BAN_MEMBERS\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        if (!userMember) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Ban**\n- Permanently ban a user if they are breaking rules.\n\nTo use the command, use \`${guild.prefix}ban <user> <reason>\`\nIf you want silence the ban, include \`-s\` in the message.`)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        Users.findOne({
            guildID: msg.guild.id,
            userID: userMember.id
        }, async (err, userDB) => {
            if (err) return console.log(err);


            if (userMember.id === msg.author.id) {
                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Ban** | *Error*\n> You can't ban yourself.`)
                    .setColor(config.color);
                return channel.send(noAccessEmbed);
            }


            if (userMember.hasPermission("MANAGE_MESSAGES")) {
                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Ban** | *Error*\n> You can't ban this person.`)
                    .setColor(config.color);
                return channel.send(noAccessEmbed);
            }
            let message = args.slice(1).join(" ");

            let silent;
            if (message.toLowerCase().includes("-s")) {
                message.replace("-s", "")
                silent = true;
            } else {
                silent = false;
            }


            if (!message) {
                message = "No Reason spesified.";
            }

            userDB.punishments.bans = userDB.punishments.bans + 1;

            userDB.save().catch(err => console.log(err));

            let logChannel = msg.guild.channels.find(c => c.id === guild.channels.botLogs);
            if (!logChannel) {
                logChannel = msg.guild.channels.find(c => c.name === "blogs");
            }
            if (!logChannel) return;
            if (silent === false) {
                let channelEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Banned**\n> \`${userMember.user.tag}\` got banned by \`${msg.author.tag}\`!\n- \`${message}\``);
                channel.send(channelEmbed);
                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Banned**\nA user has been banned.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);
                logChannel.send(logEmbed);
            } else {
                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Banned** | *Silent*\nA user has been banned.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);
                logChannel.send(logEmbed);
            }

            let channelEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Banned**\n> You got banned from \`${msg.guild.name}\` by \`${msg.author.tag}\`!\n> Reason \`${message}\``);
            await userMember.send(channelEmbed);
            await userMember.ban(`Techno | ${message}`);

        })
    });
}