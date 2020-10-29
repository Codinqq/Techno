const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    let amount = args[0];
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {
        if (err) return console.log(err);

        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Clear** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`MANAGE_MESSAGES\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        if (!amount) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Clear**\n- Clear the chat if there's something that should be removed.\n\nTo use the command, use \`${guild.prefix}clear <amount> [reason]\`\nIf you want silence the temp-mute, include \`-s\` in the message.`)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        if (isNaN(amount)) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Clear** | *Error*\nYou didn't spesify a number.\n\n> \`${guild.prefix}Clear <amount> [reason]\``)
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
                .setDescription(`**Clear**\n> The chat was cleared by \`${msg.author.tag}\`!\n- \`${message}\``);
            channel.send(channelEmbed).then(m => m.delete(3000));
            let logEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Clear**\nThe chat has been cleared.\n> Moderator \`${msg.author.tag}\`\n> Amount \`${amount}\`\n> Reason \`${message}\``);
            logChannel.send(logEmbed);
        } else {
            let logEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Clear** | *Silent*\nThe chat has been cleared.\n> Moderator \`${msg.author.tag}\`\n> Amount \`${amount}\`\n> Reason \`${message}\``);
            logChannel.send(logEmbed);
        }

        await channel.bulkDelete(amount);

    })
}