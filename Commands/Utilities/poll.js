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
                .setDescription(`**Polls** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`ADMINISTRATOR\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        let pollMessage = args.slice(0).join(" ");

        if (!pollMessage) {
            let noPollMessage = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Polls**\n- Use this command to make the guild-members choose over two different things.\n\nTo use the command, use \`${guild.prefix}poll <message>\`\nIf you want to send the poll in the current channel, include \`-c\` in the message.`)
            return channel.send(noPollMessage);
        }

        let pollChannel = msg.guild.channels.find(c => c.name === "polls");

        if (msg.content.toLowerCase().includes("-c")) {
            pollMessage = pollMessage.replace("-c", " ");
            pollChannel = msg.channel;
        }

        if (!pollChannel) {
            let nopollChannel = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Polls** | *Error*\n*I couldn't find any channels named \`#polls\`*\n- To fix this, either make a channel named \`polls\` or use \`${guild.prefix}setup\`!`);
            return channel.send(nopollChannel);
        }

        if (msg.content.toLowerCase().includes("-c")) {
            pollMessage = pollMessage.replace("-c", " ");
            pollChannel = msg.channel;
        }

        let pollEmbed = new Discord.RichEmbed()
            .setDescription(`**Poll by ${msg.author.tag}**\n- ${pollMessage}`)
            .setColor(config.color);

        pollChannel.send(pollEmbed).then(async m => {
            await m.react("✅");
            await m.react("⛔");
        })
    });
};