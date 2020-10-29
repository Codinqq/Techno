const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const codinq = require("codinqpackage");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    Dashboard.findOne({
        guildID: msg.guild.id
    }, (err, guild) => {
        if (err) return console.log(err);

        msg.delete();
        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Echo** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`MANAGE_MESSAGES\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }
        let embed;
        let announceMessage = args.slice(0).join(" ");
        if (msg.content.toLowerCase().includes("-e")) {
            announceMessage = announceMessage.replace("-e", " ");
            embed = true;
        }

        if (!announceMessage) {
            let noAnnouncement = new Discord.RichEmbed()
                .setDescription(`**Echo**\n- Use this command to make Techno send whatever you specified.\n\nTo use the command, use \`${guild.prefix}echo <message>\`\nIf you want to make it into an embed, include \`-e\` in the message`)
                .setColor(config.color);
            return channel.send(noAnnouncement).then(m => m.delete(8000));
        }

        if (embed === true) {
            embed = (
                codinq.embeder(
                    "",
                    announceMessage,
                    config.color
                )
            );
            return channel.send(embed);
        } else {
            return channel.send(announceMessage);
        }

    });
};