const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {

        msg.delete();
        if (!msg.member.hasPermission("MANAGE_ROLES")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Promote** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`MANAGE_ROLES\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        let userMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.find(m => m.id === args[0]);
        if (!userMember) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Promote**\n- Use this command to promote a guild-member.\n\nTo use the command, use \`${guild.prefix}promote <user> <role>\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }
        Users.findOne({
            guildID: msg.guild.id,
            userID: userMember.id
        }, async (err, userDB) => {
            if (err) return console.log(err);

            let role = args.slice(1).join(" ");

            role = msg.guild.roles.find(c => c.name === role || c.id === role);

            if (!role) {
                let noAccessEmbed = new Discord.RichEmbed()
                    .setDescription(`**Promote** | *Error*\n> You did not specify a role\n\n- To use the command, use \`${guild.prefix}promote <user> <role>\``)
                    .setColor(config.color);
                return channel.send(noAccessEmbed);
            }

            let logChannel = msg.guild.channels.find(c => c.id === guild.channels.botLogs);
            if (!logChannel) {
                logChannel = msg.guild.channels.find(c => c.name === "blogs");
            }
            if (!logChannel) return;


            let logEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Promoted**\n user has been promoted.\n> User \`${userMember.user.tag}\`\n> Id \`${userMember.id}\`\n> Role ${role}\n> Moderator \`${msg.author.tag}\``);
            logChannel.send(logEmbed);

            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Promote**\n> Successfully added ${role} to \`${userMember.user.tag}\``)
                .setColor(config.color);
            userMember.addRole(role);
            return channel.send(noAccessEmbed);
        });
    });
};