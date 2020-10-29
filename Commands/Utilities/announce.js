const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    Dashboard.findOne({
        guildID: msg.guild.id
    }, (err, guild) => {
        if (err) return console.log(err);

        msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Announcement** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`ADMINISTRATOR\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        let everyoneMessage = "@everyone";
        let announceMessage = args.slice(0).join(" ");
        let announceChannel = msg.guild.channels.find(c => c.name === "announcements");
        if (msg.content.toLowerCase().includes("-c")) {
            announceMessage = announceMessage.replace("-c", " ");
            announceChannel = msg.channel;
        }
        if (msg.content.toLowerCase().includes("-l")) {
            announceMessage = announceMessage.replace("-l", " ");
            announceChannel = msg.channel;
            everyoneMessage = "@here";
        }
        if (!announceChannel) {
            let noAnnounceChannel = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Announcements** | *Error*\n- *I couldn't find any channels named \`#announcements\`*\n\nTo fix this, either make a channel named \`announcements\` or use \`${guild.prefix}setup\`!\nIf you want to broadcast to current channel, include \`-c\` in the message.\nIf you want to announce something in the current channel, with @here, include \`-l\` in the message.`)
            return channel.send(noAnnounceChannel).then(m => m.delete(8000));
        }


        if (!announceMessage) {
            let noAnnouncement = new Discord.RichEmbed()
                .setDescription(`**Announcements**\n- Announce something to the guild.\n\nTo use the command, use \`${guild.prefix}announce <message>\`\nIf you want to broadcast to current channel, include \`-c\` in the message.\nIf you want to announce something in the current channel, with @here, include \`-l\` in the message.`)
                .setColor(config.color);
            return channel.send(noAnnouncement).then(m => m.delete(8000));
        }

        let sentEmbed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`The announcement has been sent in ${announceChannel}!`);
        channel.send(sentEmbed).then(m => m.delete(3000));
        let announceEmbed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Announcement by ${msg.author.tag}**\n- ${announceMessage}`);

        announceChannel.send(announceEmbed);
        return announceChannel.send(everyoneMessage);
    });
};