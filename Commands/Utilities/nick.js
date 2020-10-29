const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {

        let userMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.find(m => m.id === args[0]);
        Users.findOne({
            guildID: msg.guild.id,
            userID: userMember.id
        }, async (err, userDB) => {
            if (err) return console.log(err);

            if (!userMember) {

                if (!msg.member.hasPermission("CHANGE_NICKNAME")) {
                    let noAccessEmbed = new Discord.RichEmbed()
                        .setDescription(`**Nick** | *Permission Denied*\n- You do not have access to change your own nickname.\n- Required perms » \`CHANGE_NICKNAME\``)
                        .setColor(config.color);
                    return channel.send(noAccessEmbed);
                }

                let nickname = args.slice(0).join(" ");

                if (!nickname) {
                    let noAccessEmbed = new Discord.RichEmbed()
                        .setDescription(`**Nick** | *Error*\n> You did not specify a nickname`)
                        .setColor(config.color);
                    return channel.send(noAccessEmbed);
                }

                if (nickname === "reset") {
                    let noAccessEmbed = new Discord.RichEmbed()
                        .setDescription(`**Nick**\n> Successfully reset your nickname.`)
                        .setColor(config.color);
                    msg.member.setNickname(msg.author.username);
                    return channel.send(noAccessEmbed);
                }

                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Nick**\nA user changed their nickname.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Nickname \`${nickname}\``);
                logChannel.send(logEmbed);

                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Nick**\n> Successfully set your nickname to \`${nickname}\``)
                    .setColor(config.color);
                msg.member.setNickname(nickname);
                return channel.send(noAccessEmbed);

            } else {

                if (!msg.member.hasPermission("MANAGE_NICKNAME")) {
                    let noAccessEmbed = new Discord.RichEmbed()
                        .setDescription(`**Nick** | *Permission Denied*\n- You do not have access to nick others.\n- Required perms » \`MANAGE_NICKNAME\``)
                        .setColor(config.color);
                    return channel.send(noAccessEmbed);
                }

                let nickname = args.slice(1).join(" ");

                if (!nickname) {
                    let noAccessEmbed = new Discord.RichEmbed()
                        .setDescription(`**Nick** | *Error*\n> You did not spesify a nickname`)
                        .setColor(config.color);
                    return channel.send(noAccessEmbed);
                }
                if (nickname === "reset") {
                    let noAccessEmbed = new Discord.RichEmbed()
                        .setDescription(`**Nick**\n> Successfully reset ${userMember.user.tag}'s nickname.`)
                        .setColor(config.color);
                    userMember.setNickname(userMember.user.username);
                    return channel.send(noAccessEmbed);
                }
                let logChannel = msg.guild.channels.find(c => c.id === guild.channels.botLogs);
                if (!logChannel) {
                    logChannel = msg.guild.channels.find(c => c.name === "blogs");
                }
                if (!logChannel) return;

                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Nick**\n user has been nicknamed.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Nickname \`${nickname}\`\n> Moderator \`${msg.author.tag}\``);
                logChannel.send(logEmbed);

                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Nick**
        > Successfully set ${userMember.user.tag}'s nickname to \`${nickname}\``)
                    .setColor(config.color);
                userMember.setNickname(nickname);
                return channel.send(noAccessEmbed);
            };



        });
    });
};