const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    let userMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(m => m.id === args[0]);


    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {
        if (err) return console.log(err);

        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Warn** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`MANAGE_MESSAGES\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        if (!userMember) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Warn**\n- Warn a user if they are breaking rules.\n\nTo use the command, use \`${guild.prefix}warn <user> <reason>\`\nIf you want silence the warning, include \`-s\` in the message.`)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        Users.findOne({
            guildID: msg.guild.id,
            userID: userMember.id
        }, (err, user) => {
            msg.delete();
            if (err) return console.log(err);

            if (userMember.id === msg.author.id) {
                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Warn** | *Error*\n> You can't warn yourself.`)
                    .setColor(config.color);
                return channel.send(noAccessEmbed);
            }


            if (userMember.hasPermission("MANAGE_MESSAGES")) {
                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Warn** | *Error*\n> You can't warn this person.`)
                    .setColor(config.color);
                return channel.send(noAccessEmbed);
            }

            let silent;
            if (msg.content.toLowerCase().includes("-s")) {
                silent = true;
            } else {
                silent = false;
            }

            let message = args.slice(1).join(" ");

            if (!message) {
                message = "No Reason";
            }

            user.punishments.warns = user.punishments.warns + 1;

            user.save().catch(err => console.log(err));
            let logChannel = msg.guild.channels.find(c => c.id === guild.channels.botLogs);
            if (!logChannel) {
                logChannel = msg.guild.channels.find(c => c.name === "blogs");
            }
            if (!logChannel) return;
            if (silent === false) {
                let channelEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Warning**\n> \`${userMember.user.tag}\` got warned by \`${msg.author.tag}\`!\n> Reason \`${message}\``);
                channel.send(channelEmbed);
                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Warning**\nA user has been warned.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);
                logChannel.send(logEmbed);
            } else {
                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Warning** | *Silent*\nA user has been warned.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);
                logChannel.send(logEmbed);
            }

            let logEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Warning**\nA user has been warned.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);

            let channelEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Warning**\n> You got warned by \`${msg.author.tag}\` in \`${msg.guild.name}\`!\n- \`${message}\``);
            userMember.send(channelEmbed);
        })
    });
}