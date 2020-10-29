const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
const ms = require("ms");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    let userMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.get(m => m.id === args[0]);
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {
        if (err) return console.log(err);

        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Temp-Mute** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`MANAGE_MESSAGES\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        if (!userMember) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Temp-Mute**\n- Temporarily mute a user if they are breaking rules.\n\nTo use the command, use \`${guild.prefix}tempmute <user> <time> <reason>\`\n\nIf you want silence the temp-mute, include \`-s\` in the message.`)
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
                    .setDescription(`**Temp-Mute** | *Error*\n> You can't temp-mute yourself.`)
                    .setColor(config.color);
                return channel.send(noAccessEmbed);
            }


            if (userMember.hasPermission("MANAGE_MESSAGES")) {
                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Temp-Mute** | *Error*\n> You can't temp-mute this person.`)
                    .setColor(config.color);
                return channel.send(noAccessEmbed);
            }

            let message = args.slice(2).join(" ");

            let silent;
            if (message.toLowerCase().includes("-s")) {
                message.replace("-s", "")
                silent = true;
            } else {
                silent = false;
            }
            let time = args[2];

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
                    .setDescription(`**Temp-Mute**\n> \`${userMember.user.tag}\` got tempmuted by \`${msg.author.tag}\`!\n> Reason \`${message}\``);
                channel.send(channelEmbed);
                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Temp-Mute**\n user has been muted.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\`\n> Time \`${time}\``);
                logChannel.send(logEmbed);
            } else {
                let logEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Temp-Mute** | *Silent*\nA user has been muted.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\`\n> Time \`${time}\``);
                logChannel.send(logEmbed);
            }
            let role = msg.guild.roles.find(r => r.name === "Muted");

            if (!role) {
                try {
                    role = await msg.guild.createRole({
                        name: "Muted",
                        color: "#000000",
                        permissions: []
                    });
                    msg.guild.channels.forEach(async (channel, id) => {
                        await channel.overwritePermissions(role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                    });
                    role.setPosition(1);
                } catch (e) {
                    console.log(e.stack);
                }
            }


            let channelEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Temp-Mute**\n> You got temporarily muted in \`${msg.guild.name}\` by \`${msg.author.tag}\`!\n> Reason \`${message}\``);
            await userMember.send(channelEmbed);
            await userMember.addRole(role);


            setTimeout(() => {
                userMember.removeRole(role);
                let logEmbedd = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Temp-Mute**\nA user has has been unmuted.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`TempMute - UnMute\``);

                logChannel.send(logEmbedd);

            }, ms(time));



        })
    });
}