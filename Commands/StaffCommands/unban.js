const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    let id = args[0];
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {
        if (err) return console.log(err);

        if (!msg.member.hasPermission("BAN_MEMBERS")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Unban** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`BAN_MEMBERS\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        if (!id) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Unban**\n- Unban a user if they are breaking rules.\n\nTo use the command, use \`${guild.prefix}unban <user-id>\`\nIf you want silence the warning, include \`-s\` in the message.`)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        if (id === msg.author.id) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Unban** | *Error*\n> You can't unban yourself.`)
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

        let logChannel = msg.guild.channels.find(c => c.id === guild.channels.botLogs);
        if (!logChannel) {
            logChannel = msg.guild.channels.find(c => c.name === "blogs");
        }
        if (!logChannel) return;
        if (silent === false) {
            let channelEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Unnanned**\n> \`${id}\` got unbanned by \`${msg.author.tag}\`!\n- \`${message}\``);
            channel.send(channelEmbed);
            let logEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Unbanned**\nA user has been unbanned.\n> Id \`${id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);
            logChannel.send(logEmbed);
        } else {
            let logEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Unbanned** | *Silent*\nA user has been unbanned.\n> Id \`${id}\`\n> Moderator \`${msg.author.tag}\`\n> Reason \`${message}\``);
            logChannel.send(logEmbed);
        }

        await msg.guild.unban(id);

    });
}