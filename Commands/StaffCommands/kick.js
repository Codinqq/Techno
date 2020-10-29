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


        if (!msg.member.hasPermission("KICK_MEMBERS")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Kick** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`KICK_MEMBERS\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        if (!userMember) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Kick**\n- Kick a user, if they are breaking rules.\n\nTo use the command, use \`${guild.prefix}kick <user> <reason>\`\nIf you want silence the kick, include \`-s\` in the message.`)
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
                    .setDescription(`**Kick** | *Error*\n> You can't kick yourself.`)
                    .setColor(config.color);
                return channel.send(noAccessEmbed);
            }


            if (userMember.hasPermission("MANAGE_MESSAGES")) {
                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Kick** | *Error*\n> You can't kick this person.`)
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
                message = "No Reason.";
            }

            userDB.punishments.kicks = userDB.punishments.kicks + 1;

            userDB.save().catch(err => console.log(err));

            let logChannel = msg.guild.channels.find(c => c.id === guild.channels.botLogs);
            if (!logChannel) {
                logChannel = msg.guild.channels.find(c => c.name === "blogs");
            }
            if (!logChannel) return;
            if (silent === false) {
                let channelEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Kicked**\n> \`${userMember.user.tag}\` got kicked by \`${msg.author.tag}\`!\n- \`${message}\``);
                channel.send(channelEmbed);
                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Kicked**\nA user has been kicked.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);
                logChannel.send(logEmbed);
            } else {
                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Kicked** | *Silent*\nA user has been kicked.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);
                logChannel.send(logEmbed);
            }

            let channelEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Kicked**\n> You got kicked from \`${msg.guild.name}\` by \`${msg.author.tag}\`!\n> Reason \`${message}\``);
            await userMember.send(channelEmbed);
            await userMember.kick(`Techno | ${message}`);
        })
    });
}