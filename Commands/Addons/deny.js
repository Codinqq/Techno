const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const math = require("mathjs");

const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();

    if(!msg.member.hasPermission("ADMINISTRATOR")) {
        let noAccessEmbed = new Discord.RichEmbed()
        .setDescription(`**Deny** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`ADMINISTRATOR\``)
        .setColor(config.color);
        return channel.send(noAccessEmbed);
    }

    let embed = new Discord.RichEmbed()
    .setColor(config.color);
    Dashboard.findOne({guildID: msg.guild.id}, async (err, guild) => {
        if(err) return console.log(err);

    let userMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.find(m => m.id === args[0]);

    if(!userMember) {
        return channel.send(embed.setDescription(`**Deny**\n- Deny a users application.\n\n> To use the command, use \`${guild.prefix}deny <user> <reason>\``));
    }

    let reason = args.slice(1).join(" ");
    if(!reason) {
        return channel.send(embed.setDescription(`**Deny** | *Error*\n> You didn't define a reason.\n\n> Usage \`${guild.prefix}deny <user> <reason>\``));
    }
    let logChannel = msg.guild.channels.find(c => c.id === guild.channels.botLogs);
        if(!logChannel){
            logChannel = msg.guild.channels.find(c => c.name === "blogs");
        }
        if(!logChannel) return;


    logChannel.send(embed.setDescription(`**Denied**\nA user has been denied.\n\n> Accepted \`${userMember.user.tag}\`\n> Reason \`${reason}\``));

    return userMember.send(embed.setDescription(`**Denied**\nYour application on \`${msg.guild.name}\` was denied.\n\n> Reason \`${reason}\``));
    });
}
