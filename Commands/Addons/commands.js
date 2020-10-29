const mongoose = require("mongoose");
const Config = require("../../models/dashboard.js");
const CustomCmds = require("../../models/customcmds.js");
const emoji = require('../../emojis.js');
const ms = require("ms");


module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    let CMDres = "";

    CustomCmds.find({
        guildID: msg.guild.id
    }, async (err, guild) => {
        if (err) return console.log(err);

        for (var i in guild) {
            let type = "";
            if (guild[i].prefix) {
                type = `With Prefix`
            } else {
                type = "Without prefix"
            }
            CMDres += `> ${guild[i].cmdName} | ${guild[i].cmdResponse} | ${type} | ${guild[i].cmdInfo}\n`;

        }

        if (CMDres === "" || !CMDres) {
            CMDres = "No commands found.";
        }

        let embed = await new Discord.RichEmbed()
            .setDescription(`**Custom Commands**\n\n${CMDres}`)
            .setColor(config.color);

        return channel.send(embed);
    });
}